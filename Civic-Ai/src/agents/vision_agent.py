import torch
import numpy as np
import cv2
from pathlib import Path
from torchvision import transforms
import albumentations as A
from albumentations.pytorch import ToTensorV2
from vision.model import VisionModel

def load_model(ckpt_path, device=None):
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    ckpt = torch.load(ckpt_path, map_location=device)
    classes = ckpt.get("classes")
    backbone = ckpt.get("backbone", "efficientnet_b0")
    model = VisionModel(backbone=backbone, num_classes=len(classes), pretrained=False)
    model.load_state_dict(ckpt["model_state"])
    model.to(device).eval()
    return model, classes, device

def preprocess(img_bgr, image_size=224):
    img = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    aug = A.Compose([A.Resize(image_size, image_size), A.Normalize(), ToTensorV2()])
    out = aug(image=img)['image'].unsqueeze(0)
    return out

def infer_image_bytes(image_bytes, model, classes, device, image_size=224):
    import numpy as np
    arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise RuntimeError("Failed to decode image")
    x = preprocess(img, image_size=image_size).to(device)
    with torch.no_grad():
        logits, sev_logits = model(x)
        probs = torch.softmax(logits, dim=1).cpu().numpy()[0]
        sev_probs = torch.softmax(sev_logits, dim=1).cpu().numpy()[0]
    idx = int(probs.argmax())
    cat = classes[idx]
    conf = float(probs[idx])
    sev_idx = int(sev_probs.argmax())
    sev_map = {0:"low",1:"medium",2:"high"}
    severity = sev_map.get(sev_idx, "medium")
    return {
        "issue_type": cat,
        "category_confidence": conf,
        "severity": severity,
        "severity_confidence": float(sev_probs[sev_idx])
    }

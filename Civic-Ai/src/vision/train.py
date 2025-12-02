# src/vision/train.py
import argparse
import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from tqdm.auto import tqdm
import numpy as np
from sklearn.metrics import f1_score
from dataset import FolderImageDataset, get_transform
from model import VisionModel

def train(args):
    ds = FolderImageDataset(args.data_dir, transform=get_transform(args.image_size, is_train=True))
    classes = ds.classes
    num_classes = len(classes)
    print("Found classes:", classes)
    # split
    n = len(ds)
    n_val = max( int(0.1*n), 10)
    n_train = n - n_val
    train_ds, val_ds = random_split(ds, [n_train, n_val])
    train_loader = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True, num_workers=4, pin_memory=True)
    val_loader = DataLoader(val_ds, batch_size=args.batch_size, shuffle=False, num_workers=4, pin_memory=True)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = VisionModel(backbone=args.backbone, num_classes=num_classes, pretrained=True).to(device)
    optimizer = AdamW(model.parameters(), lr=args.lr, weight_decay=1e-5)
    scheduler = CosineAnnealingLR(optimizer, T_max=max(1, args.epochs))
    loss_fn = nn.CrossEntropyLoss()

    best_f1 = 0.0
    scaler = torch.cuda.amp.GradScaler() if torch.cuda.is_available() else None

    for epoch in range(1, args.epochs+1):
        model.train()
        losses = []
        pbar = tqdm(train_loader, desc=f"Epoch {epoch} train")
        for images, labels, _ in pbar:
            images = images.to(device)
            labels = labels.to(device)
            optimizer.zero_grad()
            with torch.cuda.amp.autocast(enabled=(scaler is not None)):
                logits, sev_logits = model(images)
                loss = loss_fn(logits, labels)
            if scaler:
                scaler.scale(loss).backward()
                scaler.step(optimizer)
                scaler.update()
            else:
                loss.backward()
                optimizer.step()
            losses.append(loss.item())
            pbar.set_postfix(train_loss=np.mean(losses))
        scheduler.step()

        # validate
        model.eval()
        preds = []
        trues = []
        with torch.no_grad():
            for images, labels, _ in tqdm(val_loader, desc="Validating"):
                images = images.to(device)
                labels = labels.to(device)
                logits, _ = model(images)
                p = torch.softmax(logits, dim=1).argmax(dim=1).cpu().numpy()
                preds.extend(p.tolist())
                trues.extend(labels.cpu().numpy().tolist())
        f1 = f1_score(trues, preds, average='macro')
        print(f"Epoch {epoch} | val_f1: {f1:.4f}")
        if f1 > best_f1:
            best_f1 = f1
            os.makedirs(os.path.dirname(args.out), exist_ok=True)
            torch.save({
                "model_state": model.state_dict(),
                "classes": classes,
                "backbone": args.backbone
            }, args.out)
            print("Saved best:", args.out)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", type=str, default="data/images")
    parser.add_argument("--out", type=str, default="models/vision/best.pth")
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch_size", type=int, default=16)
    parser.add_argument("--lr", type=float, default=1e-4)
    parser.add_argument("--image_size", type=int, default=224)
    parser.add_argument("--backbone", type=str, default="efficientnet_b0")
    args = parser.parse_args()
    train(args)

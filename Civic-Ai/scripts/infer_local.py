# scripts/infer_local.py
import sys
from orchestrator.main import Orchestrator

def main(img_path):
    orch = Orchestrator(vision_ckpt="models/vision/best.pth", rag_store="data/rag_store.npz")
    with open(img_path, "rb") as f:
        b = f.read()
    print(orch.handle_image(b))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/infer_local.py path/to/image.jpg")
    else:
        main(sys.argv[1])

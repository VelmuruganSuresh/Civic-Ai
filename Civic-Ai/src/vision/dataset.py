# src/vision/dataset.py
import os
import glob
import random
from pathlib import Path
import cv2
import numpy as np
import torch
from torch.utils.data import Dataset
import albumentations as A
from albumentations.pytorch import ToTensorV2

def find_images(data_dir):
    classes = []
    items = []
    for class_dir in sorted(Path(data_dir).iterdir()):
        if class_dir.is_dir():
            cls = class_dir.name
            classes.append(cls)
            for img_path in class_dir.glob("*"):
                if img_path.suffix.lower() in (".jpg", ".jpeg", ".png"):
                    items.append((str(img_path), cls))
    classes = sorted(list(set(classes)))
    return items, classes

def get_transform(image_size=224, is_train=True):
    if is_train:
        return A.Compose([
            # CHANGED: Use 'size=(h, w)' instead of positional arguments
            A.RandomResizedCrop(size=(image_size, image_size), scale=(0.8, 1.0)),
            
            A.HorizontalFlip(p=0.5),
            A.ShiftScaleRotate(shift_limit=0.05, scale_limit=0.1, rotate_limit=10, p=0.5),
            A.RandomBrightnessContrast(p=0.5),
            A.GaussNoise(p=0.2),
            A.Normalize(),
            ToTensorV2()
        ])
    else:
        return A.Compose([
            A.Resize(height=image_size, width=image_size),
            A.Normalize(),
            ToTensorV2()
        ])


class FolderImageDataset(Dataset):
    def __init__(self, data_dir, classes=None, transform=None):
        self.data_dir = data_dir
        self.items, self.classes = find_images(data_dir)
        if classes is not None:
            # filter by classes list if provided
            self.classes = classes
            self.items = [it for it in self.items if it[1] in classes]
        self.class_to_idx = {c:i for i,c in enumerate(self.classes)}
        self.transform = transform or get_transform()
    def __len__(self):
        return len(self.items)
    def __getitem__(self, idx):
        img_path, cls = self.items[idx]
        image = cv2.imread(img_path)
        if image is None:
            raise RuntimeError(f"Failed to read {img_path}")
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        if self.transform:
            augmented = self.transform(image=image)
            image = augmented["image"]
        label = self.class_to_idx[cls]
        return image, label, img_path

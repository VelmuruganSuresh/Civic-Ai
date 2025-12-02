# src/vision/model.py
import timm
import torch.nn as nn

class VisionModel(nn.Module):
    def __init__(self, backbone='efficientnet_b0', num_classes=8, pretrained=True):
        super().__init__()
        # 1. Create backbone. 
        # Note: We keep global_pool='avg' to ensure the pooling layer is created within the backbone
        self.backbone = timm.create_model(backbone, pretrained=pretrained, num_classes=0, global_pool='avg')
        
        feat = self.backbone.num_features
        self.classifier = nn.Linear(feat, num_classes)
        self.severity_head = nn.Linear(feat, 3)

    def forward(self, x):
        # 2. Get the features (this usually returns unpooled spatial features: B x 1280 x 7 x 7)
        x = self.backbone.forward_features(x)
        
        # 3. Explicitly Apply Global Average Pooling 
        # This turns (B, 1280, 7, 7) -> (B, 1280)
        x = self.backbone.global_pool(x)
        
        # 4. Now the shapes match for the linear layers
        logits = self.classifier(x)
        sev_logits = self.severity_head(x)
        
        return logits, sev_logits
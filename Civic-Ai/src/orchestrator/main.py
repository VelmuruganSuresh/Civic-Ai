import os
from agents.vision_agent import load_model as load_vision_model, infer_image_bytes
from agents.rag_agent import RAGAgent
from agents.decision_agent import make_decision

class Orchestrator:
    def __init__(self, vision_ckpt="models/vision/best.pth", rag_store="data/rag_store.npz"):

        self.vision_model, self.classes, self.device = load_vision_model(vision_ckpt)

        self.rag = RAGAgent(store_path=rag_store)
    def handle_image(self, image_bytes):
        vision_out = infer_image_bytes(image_bytes, self.vision_model, self.classes, self.device)

        query = vision_out["issue_type"]
        rag_results = self.rag.query(query, top_k=3)
        decision = make_decision(vision_out, rag_results)

        decision["agents_used"] = ["Vision", "RAG", "Decision"]
        return decision

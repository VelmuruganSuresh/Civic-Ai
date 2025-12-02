import numpy as np
from sentence_transformers import SentenceTransformer
from numpy.linalg import norm

class SimpleRAGRetriever:
    def __init__(self, store_path="data/rag_store.npz", embed_model="sentence-transformers/all-mpnet-base-v2"):
        data = np.load(store_path, allow_pickle=True)
        self.texts = data["texts"]
        self.embeddings = data["embeddings"]
        self.sources = data["meta_sources"]
        self.chunk_ids = data["meta_chunk_ids"]
        self.model = SentenceTransformer(embed_model)

    def retrieve(self, query, top_k=3):
        q_emb = self.model.encode([query], convert_to_numpy=True, normalize_embeddings=True)[0]

        sims = (self.embeddings @ q_emb)
        idx = np.argsort(-sims)[:top_k]
        results = []
        for i in idx:
            results.append({
                "text": str(self.texts[i]),
                "source": str(self.sources[i]),
                "chunk_id": int(self.chunk_ids[i]),
                "score": float(sims[i])
            })
        return results

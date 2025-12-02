from rag.retriever import SimpleRAGRetriever

class RAGAgent:
    def __init__(self, store_path="data/rag_store.npz", embed_model="sentence-transformers/all-mpnet-base-v2"):
        self.retriever = SimpleRAGRetriever(store_path, embed_model)
    def query(self, keywords, top_k=3):
        q = keywords if isinstance(keywords, str) else " ".join(keywords)
        return self.retriever.retrieve(q, top_k=top_k)

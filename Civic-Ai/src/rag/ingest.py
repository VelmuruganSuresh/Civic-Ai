# src/rag/ingest.py
"""
Simple RAG ingestion: reads short text files in a folder, creates sentence embeddings,
and saves them + metadata into a .npz file for retrieval by cosine similarity.
"""
import argparse
import os
import glob
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
from pathlib import Path

def load_docs(folder):
    docs = []
    for file in sorted(Path(folder).glob("*")):
        if file.suffix.lower() in [".txt", ".md"]:
            txt = file.read_text(encoding="utf-8")
            docs.append({"source": file.name, "text": txt})
        elif file.suffix.lower() in [".pdf"]:

            print("Skipping pdf (not supported by simple ingest):", file)
    return docs

def chunk_text(text, chunk_size=200):

    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
    return chunks

def ingest(args):
    model = SentenceTransformer(args.embed_model)
    docs = load_docs(args.docs_dir)
    texts = []
    meta = []
    for d in docs:
        chunks = chunk_text(d["text"], chunk_size=args.chunk_words)
        for i,ch in enumerate(chunks):
            texts.append(ch)
            meta.append({"source": d["source"], "chunk_id": i})
    if len(texts)==0:
        print("No text blocks found in", args.docs_dir)
        return
    embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True, normalize_embeddings=True)
    out = {
        "texts": np.array(texts, dtype=object),
        "embeddings": embeddings,
        "meta_sources": np.array([m["source"] for m in meta], dtype=object),
        "meta_chunk_ids": np.array([m["chunk_id"] for m in meta], dtype=int)
    }
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    np.savez_compressed(args.out, **out)
    print("Saved RAG store to", args.out)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--docs_dir", type=str, default="data/rag_docs")
    parser.add_argument("--out", type=str, default="data/rag_store.npz")
    parser.add_argument("--embed_model", type=str, default="sentence-transformers/all-mpnet-base-v2")
    parser.add_argument("--chunk_words", type=int, default=150)
    args = parser.parse_args()
    ingest(args)

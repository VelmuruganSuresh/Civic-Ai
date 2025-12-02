# civic-ai

Minimal Multi-Agent (Vision) + RAG demo — image-only pipeline.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

# Civic Resolve AI

A deep-learning powered Computer Vision system designed to detect civic issues such as:

- Potholes
- Garbage
- Fallen trees
- Water leakage
- Drain block
- Dead animals
- Streetlight issues

## Features

- EfficientNet-based image classification
- PyTorch training pipeline
- Albumentations image augmentation
- FastAPI inference API
- Clean folder structure
- Easy to retrain with your own data

---

🚀 Civic-Resolve-AI
AI-powered Civic Issue Classification + Multi-Agent Reasoning + RAG Support

Civic-Resolve-AI is an intelligent multi-agent system that helps municipal corporations automatically classify public issues submitted by citizens through images. The system uses:

🖼️ Vision Model (EfficientNet) for image-based issue classification

📚 RAG (Retrieval-Augmented Generation) for department-specific knowledge

🤖 Multi-Agent Architecture for smart decision-making

⚡ FastAPI Backend for app integration

## This project helps automate complaint routing like:

✔ Pothole → Roads Department
✔ Garbage → Sanitation
✔ Water Leak → Water Supply
✔ Dead Animal → Sanitary Department
✔ Drain Block → Municipality
…and more.

## 📦 Folder Structure

civic-ai/
│
├── data/
│ ├── images/ # Training images for the vision model
│ └── rag_docs/ # PDF/TXT documents for RAG knowledge base
│
├── models/ # Saved trained models (vision_best.pth)
│
├── src/
│ ├── vision/
│ │ ├── train.py # Train the vision classifier
│ │ ├── dataset.py # Image dataset loader
│ │ └── model.py # EfficientNet model
│ │
│ ├── rag/
│ │ ├── ingest.py # Convert RAG docs into vector embeddings
│ │ └── retriever.py # Retrieve best matches from knowledge base
│ │
│ ├── agents/
│ │ ├── vision_agent.py # Image classification agent
│ │ ├── rag_agent.py # RAG answer agent
│ │ └── decision_agent.py # Final decision logic
│ │
│ ├── orchestrator/
│ │ └── main.py # Multi-agent intelligence pipeline
│ │
│ └── api/
│ └── main.py # FastAPI backend
│
├── requirements.txt
└── README.md

## 🧠 Features

✔ Image classification using EfficientNet

Classifies civic issues into categories:

pothole

garbage

water_leak

drain_block

dead_animal

streetlight

fallen_tree

✔ RAG-based department knowledge retrieval

Understands relevant rules, government departments, and actions.

✔ Multi-Agent architecture

Vision Agent → predicts issue type

RAG Agent → retrieves relevant department information

Decision Agent → final output with reasoning

✔ FastAPI backend

Easily integrates into mobile or web apps.

🏋️ Train the Vision Model
1️⃣ Activate your virtual environment
.\.venv\Scripts\activate

2️⃣ Install packages
pip install -r requirements.txt

3️⃣ Train the model
python src/vision/train.py

Your trained model will be saved at:

models/vision_best.pth

🧪 Test the Model (Standalone)
python src/vision/test_image.py --image sample.jpg

🚀 Run the FastAPI Server

Make sure the model is already trained.

uvicorn src.api.main:app --reload

Then open:

http://127.0.0.1:8000/docs

📲 API Endpoints
1️⃣ Upload an Issue Image
POST /predict

Returns:

predicted class

confidence

department

suggested action

📘 RAG Setup
Add documents to:
data/rag_docs/

Ingest the RAG documents:
python src/rag/ingest.py

🛠️ Tech Stack
Component Technology
Vision Model EfficientNet (timm)
Vector Store FAISS
RAG Sentence-transformers
Backend FastAPI
Agents Custom Python multi-agent framework
Training PyTorch
🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

📄 License

MIT License

import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from orchestrator.main import Orchestrator
from db.database import connect_to_mongo, close_mongo_connection
from src.services.geo_service import geo_engine
from src.services.llm_service import llm_engine
from src.routes import complaints, auth
app = FastAPI(title="Civic AI - Integrated Backend")

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, 
    allow_methods=["*"], allow_headers=["*"]
)

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


try:
    ORCH = Orchestrator(vision_ckpt="models/vision/best.pth", rag_store="data/rag_store.npz")
except Exception as e:
    print(f"AI Load Error: {e}")
    ORCH = None


app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)


app.include_router(complaints.router, prefix="/api")
app.include_router(auth.router, prefix="/api")


@app.post("/predict/image")
async def predict_image(
    lat: str = Form(...),
    long: str = Form(...),
    file: UploadFile = File(...)
):
    if file.content_type.split("/")[0] != "image":
        raise HTTPException(status_code=400, detail="File must be an image")
    
    image_bytes = await file.read()
    
    try:

        is_valid, rejection_reason = llm_engine.validate_image(image_bytes)
        if not is_valid:
            return {"status": "rejected", "message": rejection_reason}


        result = ORCH.handle_image(image_bytes)
        issue = result.get("issue_type")
        dept = result.get("department")


        address = "Location not provided"
        if lat and long and lat != "0.0" and long != "0.0":
            address = geo_engine.get_address(float(lat), float(long))


        subject, body = llm_engine.generate_letter(issue, dept, address)

        return {
            "status": "success",
            "issue_type": issue,
            "department": dept,
            "address": address,
            "subject": subject,
            "body": body,
            "confidence": result.get("confidence"),
            "severity": result.get("severity")
        }
    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("src.api.main:app", host="0.0.0.0", port=8000, reload=True)
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from src.services.email_service import email_engine
from src.db.database import get_database
import shutil
import os
import uuid
from datetime import datetime
from bson import ObjectId

router = APIRouter()

UPLOAD_DIR = "static/uploads"

@router.post("/complaints")
async def create_complaint(
    username: str = Form(...),
    email: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    department: str = Form(...),
    issue_type: str = Form(...),
    address: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"{UPLOAD_DIR}/{unique_filename}"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        complaint_data = {
            "username": username,
            "email": email,
            "title": title,
            "description": description,
            "department": department,
            "issue_type": issue_type,
            "address": address,
            "image_url": f"/static/uploads/{unique_filename}",
            "status": "Pending",
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        db = await get_database()
        new_complaint = await db["complaints"].insert_one(complaint_data)
        
        return {"message": "Saved", "id": str(new_complaint.inserted_id)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/complaints/{department}")
async def get_complaints(department: str):
    db = await get_database()
    complaints = []
    cursor = db["complaints"].find({"department": department})
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        complaints.append(doc)
    return complaints

@router.put("/complaints/{id}/resolve")
async def resolve_complaint(id: str):
    try:
        db = await get_database()
        
        if not ObjectId.is_valid(id):
             raise HTTPException(status_code=400, detail="Invalid ID format")
        
        complaint = await db["complaints"].find_one({"_id": ObjectId(id)})
        
        if not complaint:
            raise HTTPException(status_code=404, detail="Complaint not found")

        update_result = await db["complaints"].update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": "Completed"}}
        )
        
        try:
            user_email = complaint.get("email")
            
            if user_email:
                await email_engine.send_resolution_email(
                    email=user_email,
                    username=complaint.get("username", "Citizen"),
                    title=complaint.get("title", "Civic Issue"),
                    body=complaint.get("description", ""),
                    dept=complaint.get("department", "Authority"),
                    address=complaint.get("address", "Location")
                )
                print(f"✅ Email sent to {user_email}")
            else:
                print("⚠️ No email found for this complaint record.")

        except Exception as email_error:
            print(f"❌ Failed to send email: {email_error}")

        return {"message": "Complaint status updated and user notified"}
            
    except Exception as e:
        print(f"Error updating status: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/complaints/user/{email}")
async def get_user_complaints(email: str):
    try:
        db = await get_database()
        complaints = []
        
        cursor = db["complaints"].find({"email": email}).sort("created_at", -1)
        
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            complaints.append(doc)
            
        return complaints
    except Exception as e:
        print(f"Error fetching user complaints: {e}")
        raise HTTPException(status_code=500, detail=str(e))
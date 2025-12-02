from fastapi import APIRouter, HTTPException, Body
from src.db.database import get_database
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

class GoogleToken(BaseModel):
    token: str

@router.post("/auth/google")
async def google_login(data: GoogleToken = Body(...)):
    try:
        id_info = id_token.verify_oauth2_token(data.token, requests.Request(), GOOGLE_CLIENT_ID)


        email = id_info.get("email")
        name = id_info.get("name")
        
        if not email:
            raise HTTPException(status_code=400, detail="Invalid Google Token")

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Token")


    db = await get_database()
    user = await db["users"].find_one({"email": email})

    role = "citizen"
    
    if not user:
        if email == "velmurugan812415@gmail.com":
            role = "admin"
            
        new_user = {
            "name": name,
            "email": email,
            "role": role,
            "provider": "google"
        }
        await db["users"].insert_one(new_user)
    else:
        role = user.get("role", "citizen")

    return {
        "message": "Login successful",
        "name": name,
        "email": email,
        "role": role
    }
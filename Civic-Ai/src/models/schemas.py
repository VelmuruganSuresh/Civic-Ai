from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
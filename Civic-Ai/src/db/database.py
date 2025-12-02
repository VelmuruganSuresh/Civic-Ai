from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = "civic_complaints_db"

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    try:
        db.client = AsyncIOMotorClient(MONGO_URL)
        await db.client.admin.command('ping')
        print("✅ MongoDB Connected Successfully")
        
    except Exception as e:
        print(f"❌ MongoDB Connection Error: {e}")
        db.client = None
        
async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("❌ MongoDB Disconnected")

async def get_database():
    if db.client is None:
        print("⚠️ Database client is None. Attempting to reconnect...")
        await connect_to_mongo()
        
    if db.client is None:
        raise Exception("Database connection failed. Cannot proceed.")
        
    return db.client[DB_NAME]
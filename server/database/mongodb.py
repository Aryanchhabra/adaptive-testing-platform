import os
from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from root directory
root_dir = Path(__file__).resolve().parent.parent.parent
dotenv_path = root_dir / '.env'
load_dotenv(dotenv_path=dotenv_path)

# MongoDB connection
client = None
db = None

def init_db():
    """Initialize database connection"""
    global client, db
    mongo_uri = os.getenv('MONGODB_URL', 'mongodb://localhost:27017')
    db_name = os.getenv('DATABASE_NAME', 'adaptive_test_ai')
    
    try:
        client = MongoClient(mongo_uri)
        db = client[db_name]
        print(f"Connected to MongoDB: {db_name}")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        
def get_db():
    """Get database instance"""
    global db
    if db is None:
        init_db()
    return db
    
def close_db():
    """Close database connection"""
    global client
    if client:
        client.close()
        print("MongoDB connection closed") 
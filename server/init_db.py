import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from urllib.parse import quote_plus
from data.python_questions import PYTHON_QUESTIONS

async def init_database():
    try:
        # MongoDB connection string with proper encoding
        password = quote_plus("Adaptive@123")
        url = f"mongodb+srv://Admin:{password}@cluster0.qv2dg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        
        # Create client
        client = AsyncIOMotorClient(url)
        db = client.adaptive_quiz
        
        # Clear existing questions
        await db.questions.delete_many({})
        
        # Insert questions
        result = await db.questions.insert_many(PYTHON_QUESTIONS)
        print(f"Successfully loaded {len(result.inserted_ids)} questions")
        
    except Exception as e:
        print(f"Database error: {e}")
        raise e
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(init_database()) 
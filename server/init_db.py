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
        
        # Create indexes for users collection
        await db.users.create_index("email", unique=True)
        print("Created unique index on users.email")
        
        # Create indexes for questions collection
        await db.questions.create_index("topic")
        await db.questions.create_index("difficulty")
        print("Created indexes on questions collection")
        
        # Create indexes for quiz sessions 
        await db.quiz_sessions.create_index("user_id")
        print("Created index on quiz_sessions.user_id")
        
    except Exception as e:
        print(f"Database error: {e}")
        raise e
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(init_database()) 
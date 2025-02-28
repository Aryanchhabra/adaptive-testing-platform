import asyncio
from config.mongodb import MongoDB
from database.operations import QuestionOperations

async def test_database():
    try:
        # Connect to MongoDB
        db = await MongoDB.connect_db()
        print("Successfully connected to MongoDB")
        
        # Count questions
        count = await db.questions.count_documents({})
        print(f"Found {count} questions in database")
        
        # Get a sample question
        question = await QuestionOperations.get_random_question_by_criteria(
            topic="Basic Python Syntax",
            difficulty=1
        )
        print("\nSample question:", question)
        
    except Exception as e:
        print(f"Error testing database: {e}")
    finally:
        if MongoDB.client:
            await MongoDB.close_db()

if __name__ == "__main__":
    asyncio.run(test_database()) 
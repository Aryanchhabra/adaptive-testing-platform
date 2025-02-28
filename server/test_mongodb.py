import asyncio
from config.mongodb import MongoDB

async def test_connection():
    try:
        db = await MongoDB.connect_db()
        print("Successfully connected to MongoDB!")
        
        # Test write
        result = await db.test.insert_one({"test": "test"})
        print("Successfully wrote to database!")
        
        # Test read
        doc = await db.test.find_one({"test": "test"})
        print("Successfully read from database:", doc)
        
        # Clean up
        await db.test.delete_one({"test": "test"})
        print("Successfully cleaned up test data!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await MongoDB.close_db()

if __name__ == "__main__":
    asyncio.run(test_connection()) 
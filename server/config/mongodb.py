import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from urllib.parse import quote_plus
from pymongo.server_api import ServerApi

load_dotenv()

class MongoDB:
    client = None
    db = None

    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB Atlas"""
        try:
            # Only create a new connection if we don't have one
            if cls.client is None:
                # Get MongoDB connection details
                username = "Admin"
                password = "Adaptive@123"
                cluster = "cluster0.qv2dg.mongodb.net"
                database = "adaptive_quiz"

                # Create connection URL with proper encoding
                password = quote_plus(password)
                url = f"mongodb+srv://{username}:{password}@{cluster}/?retryWrites=true&w=majority&appName=Cluster0"

                # Connect with retry writes and majority write concern
                cls.client = AsyncIOMotorClient(url)
                cls.db = cls.client[database]
                
                # Test the connection
                await cls.client.admin.command('ping')
                print("Successfully connected to MongoDB Atlas!")
            
            return cls.db
            
        except Exception as e:
            print(f"Error connecting to MongoDB Atlas: {e}")
            # Don't close the client here, just set to None if it failed
            cls.client = None
            cls.db = None
            raise e

    @classmethod
    async def get_db(cls):
        """Get database connection, creating it if necessary"""
        try:
            if cls.client is None or cls.db is None:
                await cls.connect_db()
            return cls.db
        except Exception as e:
            print(f"Error getting database: {e}")
            cls.client = None
            cls.db = None
            raise e

    @classmethod
    async def close_db(cls):
        """Close the MongoDB connection properly"""
        if cls.client:
            print("Closing MongoDB connection...")
            cls.client.close()
            cls.client = None
            cls.db = None
            print("MongoDB connection closed")

    @classmethod
    def is_connected(cls):
        """Check if database connection exists"""
        return cls.client is not None and cls.db is not None 
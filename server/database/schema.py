from pymongo import MongoClient, ASCENDING, DESCENDING
from datetime import datetime
from pymongo.collection import IndexModel

def setup_database(client: MongoClient):
    db = client.adaptive_quiz
    
    # Questions collection
    if "questions" not in db.list_collection_names():
        questions = db.create_collection("questions")
        questions.create_index([("topic", ASCENDING)])
        questions.create_index([("difficulty", ASCENDING)])
        questions.create_index([("subtopics", ASCENDING)])
        questions.create_index([("success_rate", DESCENDING)])

    # User sessions collection
    if "sessions" not in db.list_collection_names():
        sessions = db.create_collection("sessions")
        sessions.create_index([("user_id", ASCENDING)])
        sessions.create_index([("created_at", DESCENDING)])
        sessions.create_index([("questions_asked", ASCENDING)])

    # User progress collection
    if "user_progress" not in db.list_collection_names():
        progress = db.create_collection("user_progress")
        progress.create_index([("user_id", ASCENDING)])
        progress.create_index([("topic", ASCENDING)])
        progress.create_index([("last_updated", DESCENDING)])

async def create_indexes(db):
    # Questions collection indexes
    await db.questions.create_indexes([
        IndexModel([("topic", ASCENDING), ("difficulty", ASCENDING)]),
        IndexModel([("subtopics", ASCENDING)]),
        IndexModel([("success_rate", DESCENDING)]),
        IndexModel([("times_used", ASCENDING)])
    ])

    # Sessions collection indexes
    await db.sessions.create_indexes([
        IndexModel([("user_id", ASCENDING)]),
        IndexModel([("created_at", DESCENDING)]),
        IndexModel([("questions_asked", ASCENDING)])
    ])

    # Compound indexes for common queries
    await db.questions.create_index([
        ("topic", ASCENDING),
        ("difficulty", ASCENDING),
        ("success_rate", DESCENDING)
    ]) 
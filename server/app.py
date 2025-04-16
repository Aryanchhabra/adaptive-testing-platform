from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
from pathlib import Path
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import json
from bson import ObjectId

# Custom JSON encoder for MongoDB types
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

# Custom JSONResponse that uses our encoder
class CustomJSONResponse(JSONResponse):
    def render(self, content):
        return json.dumps(
            content,
            cls=MongoJSONEncoder,
            ensure_ascii=False,
            allow_nan=False,
            indent=None,
            separators=(",", ":"),
        ).encode("utf-8")

# Import routers
from routes.test_routes import router as test_router
from routes.question_routes import router as question_router
from routes.auth_routes import router as auth_router
from routes.quiz_routes import router as quiz_router

# Load environment variables from root directory
root_dir = Path(__file__).resolve().parent.parent
dotenv_path = root_dir / '.env'
load_dotenv(dotenv_path=dotenv_path)

# Create FastAPI app
app = FastAPI(
    title="Adaptive Testing Platform API",
    default_response_class=CustomJSONResponse  # Use our custom response class
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
    expose_headers=["*"],  # Expose all headers
)

# Include routers
app.include_router(test_router)
app.include_router(question_router)
app.include_router(auth_router)
app.include_router(quiz_router)  # New quiz routes with user integration

@app.get("/")
async def root():
    return {"message": "Adaptive Testing Platform API"}

# Add a test endpoint to check MongoDB connection
@app.get("/api/health")
async def health_check():
    from database.mongodb import get_db
    try:
        db = get_db()
        collections = db.list_collection_names()
        question_count = len(list(db.questions.find({})))
        return {
            "status": "healthy",
            "mongodb": "connected",
            "collections": collections,
            "question_count": question_count
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content=jsonable_encoder({
                "status": "unhealthy",
                "error": str(e)
            })
        )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    
    print(f"Starting server on port {port}")
    # Use the string format for the app when using reload
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True) 
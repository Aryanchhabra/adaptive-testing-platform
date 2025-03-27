from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
from pathlib import Path

# Import routers
from routes.test_routes import router as test_router
from routes.question_routes import router as question_router

# Load environment variables from root directory
root_dir = Path(__file__).resolve().parent.parent
dotenv_path = root_dir / '.env'
load_dotenv(dotenv_path=dotenv_path)

# Create FastAPI app
app = FastAPI(title="Adaptive Testing Platform API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(test_router)
app.include_router(question_router)

@app.get("/")
async def root():
    return {"message": "Adaptive Testing Platform API"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    
    print(f"Starting server on port {port}")
    # Use the string format for the app when using reload
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True) 
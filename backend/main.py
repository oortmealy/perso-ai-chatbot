from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from core.db import setup_database, find_similar_question

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow cross-origin requests
# This is necessary for the frontend (running on a different port) to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ChatRequest(BaseModel):
    question: str

@app.on_event("startup")
def on_startup():
    """
    Actions to perform on application startup.
    This will set up the vector database.
    """
    print("Starting up and setting up the database...")
    setup_database()
    print("Startup complete.")

@app.post("/api/chat")
def chat(request: ChatRequest):
    """
    Chat endpoint that receives a question and returns the most similar answer.
    """
    if not request.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    answer = find_similar_question(request.question)
    
    if answer is None:
        # As per requirements, if no similar answer is found, we should indicate that.
        # Returning a specific message instead of a 404 might be better for the UI.
        return {"answer": "죄송합니다, 질문에 대한 답변을 찾을 수 없습니다."}
        
    return {"answer": answer}

@app.get("/")
def read_root():
    return {"message": "AI Chatbot Backend is running."}

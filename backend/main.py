from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from core.db import setup_database, find_similar_questions, is_database_ready
from core.llm import generate_answer_with_context

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
    setup_database(async_mode=True)
    print("Startup complete.")

@app.post("/api/chat")
def chat(request: ChatRequest):
    """
    Chat endpoint that receives a question and returns an AI-generated answer
    based on similar questions from the vector database.
    """
    if not request.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    if not is_database_ready():
        raise HTTPException(status_code=503, detail="Database is still initializing. Please try again in a few seconds.")

    # Find top-3 similar questions from vector DB
    qa_contexts = find_similar_questions(request.question, top_k=3)

    if not qa_contexts:
        return {"answer": "죄송합니다, 질문에 대한 답변을 찾을 수 없습니다."}

    # Generate answer using LLM with context
    answer = generate_answer_with_context(request.question, qa_contexts)

    return {"answer": answer}

@app.get("/")
def read_root():
    return {"message": "AI Chatbot Backend is running."}

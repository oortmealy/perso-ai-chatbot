from pathlib import Path

# Backend directory (two levels up from this file)
BACKEND_DIR = Path(__file__).resolve().parent.parent

# Path to the data file (moved under backend/data)
DATA_FILE_PATH = BACKEND_DIR / "data" / "Q&A.xlsx"

# Name of the sentence transformer model
EMBEDDING_MODEL = "jhgan/ko-sroberta-multitask"

# ChromaDB settings
CHROMA_PERSIST_DIR = str(BACKEND_DIR / ".chroma_db")
CHROMA_COLLECTION_NAME = "chatbot_qa"

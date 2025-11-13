from pathlib import Path

# Project root directory
ROOT_DIR = Path(__file__).resolve().parent.parent.parent

# Path to the data file
DATA_FILE_PATH = ROOT_DIR / "data" / "Q&A.xlsx"

# Name of the sentence transformer model
EMBEDDING_MODEL = "jhgan/ko-sroberta-multitask"

# ChromaDB settings
CHROMA_PERSIST_DIR = str(ROOT_DIR / "backend" / ".chroma_db")
CHROMA_COLLECTION_NAME = "chatbot_qa"

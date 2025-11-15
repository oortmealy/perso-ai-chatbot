import chromadb
from threading import Lock, Thread
from typing import List, Tuple

from .config import CHROMA_PERSIST_DIR, CHROMA_COLLECTION_NAME
from .data_loader import load_qa_data
from .embedding import get_embedding, get_embeddings

# Initialize ChromaDB client
client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)

# Get or create the collection
collection = client.get_or_create_collection(name=CHROMA_COLLECTION_NAME)

_db_ready: bool = False
_db_lock = Lock()


def _populate_database():
    """
    Loads data from the Excel file, generates embeddings, and populates the vector DB.
    This may take some time, so it can be executed in a background thread.
    """
    global _db_ready
    with _db_lock:
        if _db_ready or collection.count() > 0:
            _db_ready = True
            print("Database already populated.")
            return

        print("Populating database...")
        try:
            qa_pairs = load_qa_data()
            if not qa_pairs:
                print("No QA pairs found to populate the database.")
                _db_ready = True
                return

            questions = [q for q, _ in qa_pairs]
            answers = [a for _, a in qa_pairs]

            # Generate embeddings for all questions
            question_embeddings = get_embeddings(questions)

            # Store in ChromaDB
            ids = [str(i) for i in range(len(questions))]
            collection.add(
                embeddings=question_embeddings,
                documents=questions,
                metadatas=[{"answer": a} for a in answers],
                ids=ids,
            )
            _db_ready = True
            print("Database populated successfully.")
        except Exception as exc:
            _db_ready = False
            print(f"Failed to populate database: {exc}")


def setup_database(async_mode: bool = False):
    """
    Ensures the vector database is populated.

    Args:
        async_mode: When True, population runs in a background thread so startup returns immediately.
    """
    if collection.count() > 0:
        global _db_ready
        _db_ready = True
        print("Database already populated.")
        return

    if async_mode:
        Thread(target=_populate_database, daemon=True).start()
    else:
        _populate_database()


def is_database_ready() -> bool:
    """Returns True once QA embeddings are available."""
    return _db_ready or collection.count() > 0


def find_similar_questions(query: str, top_k: int = 3) -> List[Tuple[str, str]]:
    """
    Finds the top-k most similar questions in the database to the given query.
    """
    if not is_database_ready():
        return []

    query_embedding = get_embedding(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )

    if not results or not results['ids'][0]:
        return []

    qa_pairs: List[Tuple[str, str]] = []
    for i in range(len(results['ids'][0])):
        question = results['documents'][0][i]
        answer = results['metadatas'][0][i]['answer']
        qa_pairs.append((question, answer))

    return qa_pairs

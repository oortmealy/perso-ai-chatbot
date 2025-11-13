import chromadb
from .config import CHROMA_PERSIST_DIR, CHROMA_COLLECTION_NAME
from .data_loader import load_qa_data
from .embedding import get_embedding, get_embeddings

# Initialize ChromaDB client
client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)

# Get or create the collection
collection = client.get_or_create_collection(name=CHROMA_COLLECTION_NAME)

def setup_database():
    """
    Loads data from the Excel file, generates embeddings, and populates the vector DB.
    This should be run once during application startup.
    """
    # Check if the database is already populated
    if collection.count() > 0:
        print("Database already populated.")
        return

    print("Populating database...")
    qa_pairs = load_qa_data()
    questions = [q for q, a in qa_pairs]
    answers = [a for q, a in qa_pairs]
    
    # Generate embeddings for all questions
    question_embeddings = get_embeddings(questions)
    
    # Store in ChromaDB
    ids = [str(i) for i in range(len(questions))]
    collection.add(
        embeddings=question_embeddings,
        documents=questions,  # We store questions as documents for potential inspection
        metadatas=[{"answer": a} for a in answers],
        ids=ids
    )
    print("Database populated successfully.")

def find_similar_question(query: str, top_k: int = 1):
    """
    Finds the most similar question(s) in the database to the given query.
    """
    query_embedding = get_embedding(query)
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    
    if not results or not results['ids'][0]:
        return None

    # The result contains distances, metadatas, documents, etc.
    # We want the answer from the metadata of the most similar result.
    most_similar_metadata = results['metadatas'][0][0]
    return most_similar_metadata.get('answer')

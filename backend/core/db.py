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

def find_similar_question(query: str, top_k: int = 1, distance_threshold: float = 1.5):
    """
    Finds the most similar question(s) in the database to the given query.

    Args:
        query: User's question
        top_k: Number of top results to return
        distance_threshold: Maximum distance to consider a match (lower = more similar)
                          Default 1.5 allows reasonably similar questions

    Returns:
        Answer string if similar question found, None otherwise
    """
    query_embedding = get_embedding(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    if not results or not results['ids'][0]:
        return None

    # Check the distance/similarity score
    # ChromaDB returns distances (lower is better)
    distance = results['distances'][0][0] if results['distances'] else float('inf')

    # If distance is too high, the query is not similar enough
    if distance > distance_threshold:
        return None

    # Return the answer from the most similar result
    most_similar_metadata = results['metadatas'][0][0]
    return most_similar_metadata.get('answer')

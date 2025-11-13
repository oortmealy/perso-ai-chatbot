from sentence_transformers import SentenceTransformer
from .config import EMBEDDING_MODEL

# Load the sentence transformer model
# This might take a moment when first run, as it needs to download the model.
model = SentenceTransformer(EMBEDDING_MODEL)

def get_embedding(text: str):
    """
    Generates an embedding for the given text.
    """
    return model.encode(text, convert_to_tensor=False).tolist()

def get_embeddings(texts: list[str]):
    """
    Generates embeddings for a list of texts.
    """
    return model.encode(texts, convert_to_tensor=False).tolist()

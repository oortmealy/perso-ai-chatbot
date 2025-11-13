import pandas as pd
from .config import DATA_FILE_PATH

def load_qa_data():
    """
    Loads question and answer data from the Excel file.

    Returns:
        A list of tuples, where each tuple contains (question, answer).
    """
    if not DATA_FILE_PATH.exists():
        raise FileNotFoundError(f"Data file not found at: {DATA_FILE_PATH}")

    df = pd.read_excel(DATA_FILE_PATH)

    # The data is in the third column (index 2)
    # Questions start with "Q." and answers start with "A."
    content_column = df.iloc[:, 2]  # Get the third column

    qa_pairs = []
    current_question = None

    for item in content_column:
        if pd.isna(item):
            continue

        item_str = str(item).strip()

        if item_str.startswith('Q.'):
            # Remove "Q. " prefix
            current_question = item_str[3:].strip()
        elif item_str.startswith('A.'):
            # Remove "A. " prefix
            if current_question:
                answer = item_str[3:].strip()
                qa_pairs.append((current_question, answer))
                current_question = None

    return qa_pairs

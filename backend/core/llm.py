import os
from typing import List, Tuple
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY and GEMINI_API_KEY != "your_api_key_here":
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None


def generate_answer_with_context(user_question: str, qa_contexts: List[Tuple[str, str]]) -> str:
    """
    Generate an answer using LLM with provided Q&A contexts.

    Args:
        user_question: The user's question
        qa_contexts: List of (question, answer) tuples from vector DB

    Returns:
        Answer string from LLM
    """
    if not model:
        # Fallback to first answer if no API key
        return qa_contexts[0][1] if qa_contexts else "답변을 찾을 수 없습니다."

    # Build context from Q&A pairs
    context_text = "\n\n".join([
        f"Q: {q}\nA: {a}"
        for q, a in qa_contexts
    ])

    # Create prompt
    prompt = f"""다음은 Perso.ai에 대한 공식 Q&A 데이터입니다:

{context_text}

사용자 질문: {user_question}

위 Q&A 데이터를 바탕으로만 답변해주세요. 규칙:
1. 위 데이터에 있는 정보만 사용하세요
2. 데이터에 없는 내용은 절대 추측하거나 생성하지 마세요
3. 답변을 찾을 수 없다면 "죄송합니다, 질문에 대한 답변을 찾을 수 없습니다."라고 답하세요
4. 자연스럽고 친절한 톤으로 답변하세요
5. 한국어로 답변하세요"""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"LLM Error: {e}")
        # Fallback to first answer
        return qa_contexts[0][1] if qa_contexts else "죄송합니다, 질문에 대한 답변을 찾을 수 없습니다."

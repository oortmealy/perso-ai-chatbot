# Perso AI Chatbot

[![Release](https://img.shields.io/badge/release-v1.1.1-blue)](https://github.com/yourusername/perso-ai-chatbot/releases/tag/v1.1.1)

Perso.ai 벡터 데이터베이스(Vector DB)를 활용한 지식기반 챗봇 시스템입니다. FastAPI 백엔드가 Q&A 엑셀 데이터를 임베딩하여 벡터 DB(ChromaDB)에 저장하고, React + MUI 컴포넌트로 UI/UX를 구성했습니다. Gemini API를 사용하여 벡터 검색 결과를 맥락으로 자연스러운 답변을 생성합니다.


<img width="400" height="320" alt="image" src="https://github.com/user-attachments/assets/eb7fe054-cd37-48cb-800c-47ebbb7b0f38" /><img width="400" height="320" alt="image" src="https://github.com/user-attachments/assets/b6a0c32e-3ee8-4609-93ae-af990cc672a1" />

## 릴리즈 노트
### v1.1.1
**버그 수정**
-  로딩 인디케이터 버그 수정 : 전역 상태 관리에서 채팅별 개별 상태 관리로 변경, `Chat` 인터페이스에 `isLoading' 속성 추가

### v1.1.0
**새로운 기능**
- 스플래시 화면 추가
- 자동 채팅 제목 생성 기능
- 봇 응답 로딩 인디케이터 추가

### v1.0.0 (초기 릴리즈)
**핵심 기능**
- FastAPI + React 기본 아키텍처 구축
- ChromaDB Vector 검색 시스템 (Ko-SRoBERTa 임베딩)
- Gemini 1.5 Flash API (RAG 패턴)
- Material UI 7 기반 채팅 인터페이스
- Railway/Vercel 배포 환경 구성

---

## 프로젝트 설계

본 프로젝트는 다음 기준을 중심으로 설계 및 구현되었습니다:

### 정확성
- **데이터셋 내 답변을 정확히 반환**
  - Vector DB 유사도 검색(Cosine Similarity)으로 Top-K 유사 질문 검색 (k=3)
  - `jhgan/ko-sroberta-multitask` 한국어 임베딩 모델 사용으로 의미 기반 매칭
  - **가장 유사도가 높은 질문의 답변을 엑셀 데이터 그대로 반환**
  - 원본 데이터셋의 답변 그대로 제공해 정확성 보장

- **할루시네이션 발생률 0%**
  - 데이터셋에 존재하는 답변만 반환
  - Gemini API 사용 시: RAG 패턴으로 컨텍스트 기반 답변 생성
  - Gemini API 미사용 시: 가장 유사한 질문의 답변을 데이터셋에서 직접 반환
  - LLM 오류 발생 시에도 원본 답변으로 자동 폴백하여 서비스 안정성 보장

- **검증 로직**
  - 벡터 검색 결과가 없을 경우 명확한 오류 메시지 반환
  - LLM 응답 실패 시 자동 폴백으로 서비스 안정성 보장

### 기술 설계

#### Vector DB 및 임베딩 구조 설계
- **ChromaDB PersistentClient**
  - 로컬 개발: `backend/.chroma_db` 디렉토리에 영구 저장
  - 프로덕션: 환경 변수(`CHROMA_PERSIST_DIR`)로 저장 경로 설정 가능
  - 컬렉션 기반 데이터 관리, 서버 재시작 시에도 데이터 유지

- **임베딩 모델: `jhgan/ko-sroberta-multitask`**
  - 한국어 의미 유사도 계산에 최적화된 Sentence Transformer 모델
  - 768차원 벡터 공간에서 질문 임베딩 생성
  - CPU 환경에서도 빠른 추론 속도 (PyTorch CPU 버전 사용)

- **데이터 구조**
  - `documents`: 질문 텍스트 저장
  - `metadatas`: 답변 텍스트 저장
  - `ids`: 고유 ID로 Q&A 쌍 관리

#### 유사도 검색 로직 완성도
- **검색 파이프라인**
  ```
  사용자 질문 → 임베딩 생성 → Vector DB 쿼리 (Cosine Similarity)
  → Top-K 유사 Q&A 추출 → LLM 컨텍스트 제공 → 최종 답변 생성
  ```

- **비동기 데이터베이스 초기화**
  - FastAPI 시작 시 백그라운드 스레드에서 데이터 로드
  - 서버 응답 시간 최소화 (헬스체크 타임아웃 방지)
  - `is_database_ready()` 함수로 준비 상태 확인

- **검색 파라미터 최적화**
  - `top_k=3`: 상위 3개 유사 질문 반환
  - Cosine Similarity 기반 거리 계산
  - 메타데이터를 통한 질문-답변 쌍 정확한 매핑

### 기술 선택 이유

| 기술 | 선택 이유 |
|------|-----------|
| **ChromaDB** | • Python 네이티브 지원으로 간편한 통합<br>• 경량화된 벡터 DB로 빠른 프로토타이핑<br>• PersistentClient로 로컬/프로덕션 환경 모두 지원<br>• 별도 DB 서버 불필요 (임베디드 DB) |
| **Sentence Transformers<br>(Ko-SRoBERTa)** | • 한국어 의미 유사도 계산에 특화된 오픈소스 모델<br>• SBERT 아키텍처로 빠른 임베딩 생성<br>• Multitask 학습으로 다양한 NLP 태스크 커버<br>• 추가 학습 없이 즉시 사용 가능 |
| **Gemini 1.5 Flash** | • 빠른 응답 속도 (Flash 버전)<br>• 한국어 성능 우수<br>• 무료 tier 제공<br>• `google-generativeai` SDK로 간편한 통합 |
| **FastAPI** | • 비동기 처리로 높은 성능<br>• 자동 API 문서화 (Swagger UI)<br>• Pydantic 기반 데이터 검증<br>• Python 생태계와의 완벽한 호환성 |
| **React + MUI** | • 컴포넌트 재사용성으로 빠른 개발<br>• Material Design 기반 일관된 UI/UX<br>• 테마 커스터마이징 용이<br>• TypeScript 완벽 지원 |

---

## 시스템 구성

### 1. Backend (`/backend`)
- FastAPI 애플리케이션이 `/api/chat`, `/api/generate-title` 엔드포인트 제공
- `core/data_loader.py`가 `backend/data/Q&A.xlsx`에서 Q&A 쌍을 읽어옴
- Sentence Transformers로 질문 임베딩 생성 → ChromaDB에 저장
- Gemini 1.5 Flash 모델로 최종 답변 생성 (API 키 없으면 유사 답변 직접 반환)

### 2. Frontend (`/frontend`)
- React 19 + TypeScript + Vite 7
- Material UI 7 기반 레이아웃
- 다중 채팅 세션 관리, 자동 채팅 제목 생성
- Framer Motion 기반 스플래시 화면 애니메이션

### 3. Infrastructure
- Backend: Railway (Python 3.12, Uvicorn)
- Frontend: Vercel (Node 22, Vite 빌드)
---

## 백엔드 구조

```
backend/
├── main.py               # FastAPI 진입점, CORS, API 엔드포인트
├── core/
│   ├── config.py         # 경로, 모델명, ChromaDB 설정
│   ├── data_loader.py    # 엑셀 Q&A 데이터 로더
│   ├── embedding.py      # SentenceTransformer 로딩 및 임베딩
│   ├── db.py             # ChromaDB 초기화, 유사도 검색
│   └── llm.py            # Gemini API 호출 및 폴백 로직
├── data/
│   └── Q&A.xlsx          # 원본 Q&A 데이터 (Git ignore)
├── .chroma_db/           # ChromaDB 영구 저장소 (Git ignore)
├── requirements.txt      # Python 의존성
└── railway.json          # Railway 배포 설정
```

### 주요 기능
- **자동 데이터베이스 초기화**: 시작 시 `setup_database(async_mode=True)` 실행
- **비동기 데이터 로딩**: 백그라운드 스레드에서 임베딩 생성 및 DB 저장
- **환경 변수 지원**: `GEMINI_API_KEY`, `CHROMA_PERSIST_DIR` 등

---

## 프론트엔드 구조

```
frontend/
├── src/
│   ├── App.tsx           # 채팅 상태 관리, API 호출, 라우팅
│   ├── ChatInterface.tsx # 대화 UI, 메시지 표시, 로딩 인디케이터
│   ├── ChatList.tsx      # 채팅 목록 사이드바, 새 채팅 생성
│   ├── SplashIntro.tsx   # 스플래시 화면 애니메이션
│   ├── theme.tsx         # MUI 커스텀 테마 (#624AFF 메인 컬러)
│   └── main.tsx          # React 진입점
├── public/
│   ├── favicon.svg       # 파비콘
│   └── assets/           # 프로필 이미지 등
├── index.html            # HTML 템플릿
├── vercel.json           # SPA 라우팅 설정
└── package.json          # npm 스크립트 및 의존성
```

### 주요 기능
- **다중 채팅 세션**: 여러 대화를 동시에 관리
- **자동 제목 생성**: 첫 메시지 기반 Gemini API로 제목 생성
- **로딩 인디케이터**: 답변 생성 중 CircularProgress 표시
- **스플래시 화면**: Framer Motion 기반 타이포그래피 애니메이션

---

## 개선 idea💡

- [ ] 관리자 대시보드 (Q&A 관리, 통계)
- [ ] 유사도 비슷한 질의 들어왔을 때 드롭다운 제공(~~에 대한 응답을 원하시나요? --에 대한 응답을 원하시나요?)
- [ ] 채팅 응답에 Q&A 목록 페이지 라우팅 제공(챗봇의 응답 출처 ex. [인프라팀 Q&A 3번 질문으로 이동하기->])


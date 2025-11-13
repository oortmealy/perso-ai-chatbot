# Perso AI Chatbot

Perso.ai 소개 자료를 기반으로 질문에 답하는 퍼스널 챗봇 프로젝트입니다. FastAPI 백엔드가 Q&A 엑셀 데이터를 임베딩하여 벡터 DB(Chroma)에 저장하고, React + MUI 프런트가 사용자와 상호작용합니다. Gemini API를 사용하면 벡터 검색 결과를 맥락으로 한 자연스러운 답변을 생성할 수 있습니다.

## 시스템 구성
1. Backend (`/backend`)
   - FastAPI 애플리케이션이 `/api/chat` 엔드포인트를 제공
   - `core/data_loader.py`가 `backend/data/Q&A.xlsx`에서 Q&A 쌍을 읽어옴
   - Sentence Transformers(`jhgan/ko-sroberta-multitask`)로 질문 임베딩 생성 → Chroma Persistent DB에 저장
   - Gemini 1.5 Flash 모델로 최종 답변 생성 (API 키 없으면 가장 유사한 답변을 그대로 반환)
2. Frontend (`/frontend`)
   - React 19 + TypeScript + Vite
   - Material UI 기반 레이아웃, 다중 채팅 세션 관리 UI
   - `.env.production`의 `VITE_API_URL`을 통해 배포된 백엔드와 통신
3. Infra / Deploy
   - Backend: Railway (Python 3.12, Uvicorn)
   - Frontend: Vercel (Node 22, Vite 빌드, `frontend/vercel.json`으로 SPA 라우팅 처리)

## 기술 스택 요약
| 구분 | 사용 기술 | 비고 |
| --- | --- | --- |
| 언어 | Python 3.12, TypeScript 5+ |  |
| 백엔드 프레임워크 | FastAPI, Uvicorn | ASGI, CORS 전역 허용 |
| 데이터 처리 | pandas, openpyxl | 엑셀 Q&A 파싱 |
| 벡터/임베딩 | sentence-transformers, PyTorch CPU, ChromaDB | Ko-SRoBERTa 멀티태스크 모델 |
| LLM | Google Gemini 1.5 Flash | `google-generativeai` SDK |
| 프런트엔드 | React 19, Material UI 7, Vite 7 | SPA + Fetch API |
| 배포 | Railway, Vercel | GitHub 자동 배포 연결 가능 |

## 백엔드 구조
```
backend/
├── main.py               # FastAPI 진입점, CORS 및 /api/chat 정의
├── core/
│   ├── config.py         # 경로, 모델명, Chroma 설정
│   ├── data_loader.py    # 엑셀에서 Q/A 추출
│   ├── embedding.py      # SentenceTransformer 로딩 및 임베딩 생성
│   ├── db.py             # Chroma PersistentClient, 유사도 검색
│   └── llm.py            # Gemini API 호출 및 폴백 로직
├── data/Q&A.xlsx         # 원본 Q&A 데이터 (Git ignore 대상)
└── requirements.txt      # 런타임 의존성
```
- 애플리케이션 시작 시 `setup_database()`가 실행되어 기존 벡터 DB가 비어 있으면 자동으로 데이터를 적재합니다.
- `GEMINI_API_KEY`를 `.env`에 설정하면 LLM 응답이 활성화됩니다.

### 백엔드 로컬 실행
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export GEMINI_API_KEY=your_key  # 선택 사항
uvicorn main:app --reload --port 8000
```

## 프런트엔드 구조
```
frontend/
├── src/
│   ├── App.tsx           # 채팅 상태 관리, API 호출
│   ├── ChatInterface.tsx # 대화 UI, 입력 전송
│   ├── ChatList.tsx      # 채팅 목록/생성 UI
│   └── theme.ts          # MUI 커스텀 테마
├── public/               # 정적 자산
├── vercel.json           # SPA 라우팅 유지용 rewrite
└── package.json          # Vite 스크립트
```
- `import.meta.env.VITE_API_URL`을 사용하므로 `.env`, `.env.local`, `.env.production` 등에서 값을 주입할 수 있습니다.
- 개발 모드에서는 `npm run dev`로 5173 포트를 사용하고, API 기본값은 `http://127.0.0.1:8000/api/chat`입니다.

### 프런트엔드 로컬 실행
```bash
cd frontend
nvm use 22            # Vite 7 요구사항 (20.19+ 또는 22.12+)
npm install
npm run dev           # http://localhost:5173
```
`npm run build && npm run preview`로 배포 번들을 검증할 수 있습니다.

## 환경 변수 정리
| 위치 | 변수 | 설명 |
| --- | --- | --- |
| backend/.env | `GEMINI_API_KEY` | Gemini 1.5 Flash 호출용 API 키. 없으면 첫 번째 유사 답변을 그대로 반환 |
| frontend/.env* | `VITE_API_URL` | 백엔드 `/api/chat` URL (예: `https://perso-ai-chatbot-production.up.railway.app/api/chat`) |

## 배포 가이드
### Railway (Backend)
1. GitHub 레포를 Railway 서비스에 연결하고 Python 템플릿으로 생성
2. 환경 변수에 `GEMINI_API_KEY`, `PORT=8080` 등을 설정
3. Start Command: `uvicorn main:app --host 0.0.0.0 --port 8080`
4. Networking > Generate Domain에서 공개 URL 확보 → 프런트 `.env`에 반영

### Vercel (Frontend)
1. “Add New Project” 후 Git 레포 import
2. Root Directory를 `frontend`로 지정, Build Command `npm run build`, Output `dist`
3. Environment Variables에 `VITE_API_URL` 추가
4. Settings > Build & Development에서 Node 22 선택
5. Deploy 후 제공되는 도메인으로 접속

## 릴리즈 & 태그 전략
1. 기능이 안정되면 `master`에 병합
2. `git tag -a vX.Y.Z -m "설명" && git push origin vX.Y.Z`
3. GitHub Release를 생성하여 Vercel/Railway 배포 링크를 함께 기록하면 이력 관리에 용이합니다.

---
필요한 개선 사항이나 운영 중 발생한 이슈는 이 README에 계속 추가하여 팀 내 온보딩 자료로 활용하세요.

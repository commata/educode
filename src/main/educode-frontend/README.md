# EduCode Frontend

React 18 + TypeScript + Vite 기반의 온라인 코딩 교육 플랫폼 프론트엔드입니다.

## 실행

```bash
cp .env.example .env
npm install
npm run dev
```

기본 백엔드 주소는 `.env`의 `VITE_API_BASE_URL`로 설정합니다.

## 핵심 설계

- 서버 상태: TanStack Query
- 인증 상태: Zustand persist(localStorage)
- 폼 검증: React Hook Form + Zod
- IDE: Monaco Editor
- 라우팅: React Router
- 스타일: Tailwind CSS

## API 설계 보완

명세에 요청/응답 DTO 세부 필드가 없어서 아래처럼 보완했습니다.

- `POST /api/submissions/run`
  - request: `{ assignmentId, language, sourceCode, customInput }`
  - response: `{ status, passedCount, totalCount, stdout, stderr, compileError, systemErrorLog }`
- `POST /api/submissions/submit`
  - request: `{ assignmentId, language, sourceCode }`
  - response: `Submission`

이 보완이 필요한 이유는 IDE 실행/제출 UI를 실제 연결 가능한 수준으로 구성하려면
프론트에서 반드시 필요한 필드가 있어야 하기 때문입니다.

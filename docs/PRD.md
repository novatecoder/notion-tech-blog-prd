# PRD — AI/LLM 기술 블로그 (Notion CMS)

> Product Requirements Document  
> 버전: v1.0 · 작성일: 2026-06-07

---

## Executive Summary

Notion을 CMS(콘텐츠 관리 시스템)로 사용하는 개인 기술 블로그. 글은 Notion 데이터베이스에서 작성·관리하고, 웹사이트는 Notion API로 글을 가져와 렌더링한다. 별도 관리자 화면이나 데이터베이스 서버 없이, Notion의 편집 경험을 그대로 글쓰기 도구로 활용하는 것이 핵심이다.

대상 독자는 AI/LLM 분야의 개발자·실무자이며, 초기 콘텐츠는 LLM 애플리케이션 개발·에이전트·RAG·운영 노하우 중심이다. MVP는 **글 목록·글 상세·카테고리 필터** 3개 화면으로 한정하고, 검색·다국어 등은 후속 단계로 미룬다.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | AI/LLM 기술 블로그 (notion-tech-blog) |
| 목적 | Notion을 CMS로 활용한 개인 기술 블로그 |
| CMS 선택 이유 | Notion에서 글을 작성하면 별도 배포 없이 웹사이트에 자동 반영. 비개발자 협업자도 글 관리 가능, 무료 데이터베이스 |
| 핵심 가치 | 글쓰기와 표시(rendering)의 분리 — 콘텐츠는 Notion, 표현은 코드 |

### 왜 Notion CMS인가

전통적인 블로그는 (1) DB를 직접 운영하거나 (2) 마크다운 파일을 repo에 커밋해야 한다. Notion CMS는 그 사이를 메운다 — Notion의 익숙한 에디터로 글을 쓰면, 발행 상태만 바꿔도 사이트에 반영된다. 인프라 운영 부담 없이 콘텐츠와 코드를 분리하는 것이 도입 이유다.

---

## 2. 주요 기능

1. **글 목록**: Notion 데이터베이스에서 `Status = 발행됨`인 글을 발행일 내림차순으로 표시
2. **글 상세**: 개별 글의 Notion 페이지 본문(블록)을 HTML로 렌더링
3. **카테고리 필터링**: `Category` select 값 기준으로 목록 필터
4. **태그 표시**: `Tags` multi_select를 글 카드·상세에 노출 (MVP는 표시만, 필터는 후속)
5. **반응형 디자인**: 모바일·데스크톱 대응 (Tailwind breakpoint)

> **MVP 비포함 (후속)**: 전문 검색, 페이지네이션, 다국어, 댓글, RSS, OG 이미지 자동 생성, ISR 외 캐싱 전략.

---

## 3. 기술 스택

| 레이어 | 기술 | 비고 |
|--------|------|------|
| Frontend | **Next.js 15** (App Router), **TypeScript** | Server Components로 Notion fetch를 서버에서 처리 |
| CMS | **Notion API** (`@notionhq/client`) | Integration Token + Database 공유 |
| 블록 렌더링 | `notion-to-md` 또는 커스텀 블록 매퍼 | 본문(블록) → 마크다운/HTML |
| Styling | **Tailwind CSS**, **shadcn/ui** | 컴포넌트 프리미티브 |
| Icons | **Lucide React** | |
| Deployment | **Vercel** | ISR(Incremental Static Regeneration)로 Notion 변경 반영 |

### 환경 변수

| 변수 | 설명 |
|------|------|
| `NOTION_TOKEN` | Notion Integration Internal Token |
| `NOTION_DATABASE_ID` | 블로그 글 데이터베이스 ID |

> 토큰은 `.env.local`(git ignore) 또는 Vercel 환경변수로 주입. repo에 평문 커밋 금지.

---

## 4. Notion 데이터베이스 구조

블로그 글 데이터베이스의 속성(properties):

| 필드 | Notion 타입 | 설명 |
|------|-------------|------|
| `Title` | title | 글 제목 |
| `Slug` | rich_text | URL 경로 (예: `building-llm-agents`). 비면 Title에서 자동 생성 |
| `Category` | select | 카테고리 (예: LLM, RAG, Agent, Ops) |
| `Tags` | multi_select | 태그 (자유) |
| `Summary` | rich_text | 목록 카드용 요약 (1~2문장) |
| `Published` | date | 발행일 (목록 정렬 기준) |
| `Status` | select | `초안` / `발행됨` — `발행됨`만 사이트 노출 |
| `Cover` | files & media (선택) | 카드/상세 대표 이미지 |
| 본문 | page content (블록) | 글 본문. 상세 페이지에서 블록 렌더링 |

---

## 5. 화면 구성

| 화면 | 경로 | 설명 |
|------|------|------|
| 홈 (글 목록) | `/` | 발행된 글 카드 목록 (제목·요약·카테고리·태그·발행일). 상단에 카테고리 필터 |
| 카테고리별 목록 | `/category/[category]` | 특정 카테고리 글만 |
| 글 상세 | `/posts/[slug]` | Notion 페이지 본문 렌더링 + 메타(카테고리·태그·발행일) |
| 404 | `/not-found` | 없는 slug/카테고리 처리 |

### 데이터 흐름

```
Notion DB ──(@notionhq/client)──> Next.js Server Component ──(ISR)──> 정적 HTML
                                          │
                                  notion-to-md → 블록 렌더링
```

목록은 `databases.query`로, 상세는 `pages.retrieve` + `blocks.children.list`로 가져온다. Server Component에서 fetch하므로 토큰이 클라이언트에 노출되지 않는다.

---

## 6. MVP 범위

**포함**
- Notion API 연동 (목록 query + 상세 블록 fetch)
- 글 목록 / 글 상세 페이지
- 카테고리 필터링
- 기본 스타일링 (shadcn/ui + Tailwind)
- 반응형 디자인
- Vercel 배포 + ISR

**비포함 (후속)**
- 검색, 페이지네이션, 태그 필터, 다국어, 댓글, RSS, OG 이미지 자동화

---

## 7. 구현 단계

1. **프로젝트 셋업**: Next.js 15 + TS 스캐폴드, Tailwind·shadcn/ui·Lucide·`@notionhq/client` 설치, `.env.local` 구성
2. **Notion 준비**: Integration 생성 → Database 생성(§4 스키마) → Integration에 DB 공유 → `NOTION_DATABASE_ID` 확보
3. **데이터 레이어**: `lib/notion.ts` — `getPublishedPosts()`, `getPostBySlug()`, 블록 → 렌더 변환 + 타입 정의
4. **글 목록 페이지**: 홈(`/`) 카드 목록 + 카테고리 필터 UI
5. **글 상세 페이지**: `/posts/[slug]` 블록 렌더링 + 메타
6. **스타일링·반응형·최적화**: shadcn 컴포넌트 적용, ISR `revalidate` 설정, 이미지 최적화
7. **배포**: Vercel 연결, 환경변수 등록, 도메인 확인

---

## 8. 성공 기준 (Acceptance)

- [ ] Notion에서 `Status=발행됨` 글이 홈 목록에 발행일 내림차순으로 표시된다
- [ ] `초안` 글은 사이트에 노출되지 않는다
- [ ] 글 상세에서 Notion 본문 블록(문단·헤딩·리스트·코드·이미지)이 렌더링된다
- [ ] 카테고리 필터가 동작한다
- [ ] Notion에서 글 수정 후 ISR 주기 내에 사이트에 반영된다
- [ ] 모바일·데스크톱 레이아웃이 깨지지 않는다
- [ ] 토큰이 클라이언트 번들에 노출되지 않는다

---

## 9. 리스크 · 고려사항

| 리스크 | 대응 |
|--------|------|
| Notion API rate limit (평균 3 req/s) | 목록·상세 ISR 캐싱, 빌드 시 사전 생성 |
| 블록 타입 누락 (렌더 미지원) | 지원 블록 화이트리스트 + 미지원 시 graceful fallback |
| 토큰 노출 | Server Component에서만 fetch, `.env.local`·Vercel env, repo 평문 금지 |
| Notion 스키마 변경 | 속성 이름 상수화 + 런타임 검증 |

---

## 다음 미션

본 PRD를 기반으로 실제 Next.js + Notion CMS 블로그를 구현한다.

# CLAUDE.md — notion-tech-blog-prd

Notion을 CMS로 사용하는 AI/LLM 기술 블로그. **MVP 구현·배포 완료** — 라이브 `https://notion-tech-blog-prd.vercel.app`.

> 현재 상태: Next.js App Router 앱(`app/`·`lib/`·`components/`). 구현된 기능 — 홈 글 목록 / 글 상세(`/posts/[slug]`, 블록 렌더) / 카테고리 필터(`/category/[category]`) / 검색. `lib/notion.ts`는 `NOTION_TOKEN` 유무로 실제 Notion API ↔ `lib/sample-data.ts` 샘플 fallback 분기 — **환경변수 0개로 build·배포 가능**. 실 연동은 Vercel 프로젝트 env에 `NOTION_TOKEN`·`NOTION_DATABASE_ID` 주입.

## Project Context

- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

> 작업 시 위 두 문서를 항상 참고해 일관성 있게 개발한다. 특히 개발 순서는 ROADMAP의 **골격 → 공통 → 개별 기능** 원칙을 따른다.

## 기술 스택

Next.js 16 (App Router) · TypeScript · Notion API(`@notionhq/client`) · Tailwind CSS · Vercel(ISR). (MVP는 과제용 최소 구현 — shadcn/ui·Lucide 미도입, 필요 시 추가)

## 작업 규칙

- Notion 토큰 호출은 **서버 측(Server Component / `lib/`)에서만** — 클라이언트 번들에 토큰 노출 금지
- `NOTION_TOKEN`·`NOTION_DATABASE_ID`는 `.env.local`(git ignore) 또는 Vercel 환경변수로 주입
- 새 기능은 ROADMAP의 현재 Phase 범위 안에서 — 공통 모듈(Phase 2)이 개별 기능(Phase 3~4)보다 먼저

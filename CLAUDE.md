# CLAUDE.md — notion-tech-blog-prd

Notion을 CMS로 사용하는 AI/LLM 기술 블로그 프로젝트. 현재는 기획 문서(PRD·ROADMAP) 단계이며, 이후 Next.js + Notion API로 구현한다.

## Project Context

- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

> 작업 시 위 두 문서를 항상 참고해 일관성 있게 개발한다. 특히 개발 순서는 ROADMAP의 **골격 → 공통 → 개별 기능** 원칙을 따른다.

## 기술 스택

Next.js 15 (App Router) · TypeScript · Notion API(`@notionhq/client`) · Tailwind CSS · shadcn/ui · Lucide React · Vercel(ISR)

## 작업 규칙

- Notion 토큰 호출은 **서버 측(Server Component / `lib/`)에서만** — 클라이언트 번들에 토큰 노출 금지
- `NOTION_TOKEN`·`NOTION_DATABASE_ID`는 `.env.local`(git ignore) 또는 Vercel 환경변수로 주입
- 새 기능은 ROADMAP의 현재 Phase 범위 안에서 — 공통 모듈(Phase 2)이 개별 기능(Phase 3~4)보다 먼저

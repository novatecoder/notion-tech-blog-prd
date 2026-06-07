# notion-tech-blog-prd

Notion을 CMS로 사용하는 **AI/LLM 기술 블로그**의 제품 요구사항 문서(PRD) 저장소.

글은 Notion 데이터베이스에서 작성·관리하고, 웹사이트는 Notion API로 글을 가져와 렌더링한다. 이 저장소는 해당 웹앱을 만들기 위한 **기획 문서(PRD)**를 담고 있으며, 실제 구현은 다음 단계에서 진행한다.

## 문서

- [`docs/PRD.md`](docs/PRD.md) — 전체 PRD (개요·기능·기술 스택·Notion DB 구조·화면·MVP·구현 단계·성공 기준·리스크)

## 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | AI/LLM 기술 블로그 |
| CMS | Notion API |
| 주요 기능 | 글 목록 · 글 상세 · 카테고리 필터링 · 태그 표시 · 반응형 |
| 기술 스택 | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Lucide React |
| 배포 | Vercel (ISR) |

## 다음 단계

이 PRD를 기반으로 Next.js + Notion API 블로그를 구현한다.

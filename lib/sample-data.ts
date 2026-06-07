import type { Post, Block } from "@/types/post";

export const samplePosts: Post[] = [
  {
    id: "sample-1",
    title: "RAG 파이프라인 설계: 청킹 전략부터 리랭킹까지",
    slug: "rag-pipeline-design",
    category: "RAG",
    tags: ["RAG", "LangChain", "벡터DB", "리랭킹"],
    summary:
      "실무에서 자주 발생하는 RAG 품질 문제를 청킹 전략 조정과 크로스인코더 리랭킹으로 해결하는 방법을 다룹니다.",
    published: "2026-06-05",
    status: "발행됨",
  },
  {
    id: "sample-2",
    title: "LLM 에이전트 디자인 패턴: ReAct vs Plan-and-Execute",
    slug: "llm-agent-patterns",
    category: "Agent",
    tags: ["Agent", "ReAct", "LangGraph", "OpenAI"],
    summary:
      "ReAct와 Plan-and-Execute 패턴의 차이를 실제 구현 코드와 함께 비교하고, 어떤 상황에서 무엇을 선택해야 하는지 정리합니다.",
    published: "2026-06-01",
    status: "발행됨",
  },
  {
    id: "sample-3",
    title: "프로덕션 LLM 운영: 비용·지연·품질 트라이앵글",
    slug: "llm-ops-cost-latency-quality",
    category: "Ops",
    tags: ["LLMOps", "모니터링", "비용최적화", "Langfuse"],
    summary:
      "LLM 서비스를 프로덕션에서 운영할 때 마주치는 비용·지연·품질 트레이드오프와 실전 대응 전략을 공유합니다.",
    published: "2026-05-28",
    status: "발행됨",
  },
];

export const sampleBlocks: Record<string, Block[]> = {
  "rag-pipeline-design": [
    {
      id: "b1",
      type: "heading_1",
      text: "RAG 파이프라인 개요",
    },
    {
      id: "b2",
      type: "paragraph",
      text: "RAG(Retrieval-Augmented Generation)는 외부 지식 베이스에서 관련 문서를 검색해 LLM 응답 품질을 높이는 패턴입니다. 그러나 단순히 벡터 검색만 붙이면 실무에서는 금방 품질 한계에 부딪힙니다.",
    },
    {
      id: "b3",
      type: "heading_2",
      text: "청킹 전략",
    },
    {
      id: "b4",
      type: "paragraph",
      text: "문서를 어떻게 잘라내느냐가 검색 품질의 절반을 결정합니다. 고정 크기(fixed-size) 청킹은 구현이 단순하지만 문맥 단절 문제가 있습니다. 의미 단위 청킹(semantic chunking)은 임베딩 유사도를 기준으로 자연스러운 경계를 찾습니다.",
    },
    {
      id: "b5",
      type: "bulleted_list_item",
      text: "Fixed-size: 구현 단순, 문맥 단절 위험",
    },
    {
      id: "b6",
      type: "bulleted_list_item",
      text: "Recursive character: 자연 구분자(단락·문장) 우선 분리",
    },
    {
      id: "b7",
      type: "bulleted_list_item",
      text: "Semantic: 임베딩 유사도 기반, 높은 품질·높은 비용",
    },
    {
      id: "b8",
      type: "heading_2",
      text: "크로스인코더 리랭킹",
    },
    {
      id: "b9",
      type: "paragraph",
      text: "벡터 검색의 결과(Top-K)를 크로스인코더가 재정렬합니다. 바이인코더(bi-encoder)보다 느리지만 쿼리-문서 관련성을 훨씬 정확하게 판단합니다.",
    },
    {
      id: "b10",
      type: "code",
      text: 'from sentence_transformers import CrossEncoder\n\nreranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")\nscores = reranker.predict([[query, doc] for doc in retrieved_docs])\nreranked = sorted(zip(scores, retrieved_docs), reverse=True)',
      language: "python",
    },
  ],
  "llm-agent-patterns": [
    {
      id: "b1",
      type: "heading_1",
      text: "LLM 에이전트 디자인 패턴",
    },
    {
      id: "b2",
      type: "paragraph",
      text: "에이전트는 LLM이 도구(Tool)를 호출하며 목표를 달성하는 시스템입니다. 패턴 선택은 태스크의 복잡도와 신뢰성 요구사항에 따라 달라집니다.",
    },
    {
      id: "b3",
      type: "heading_2",
      text: "ReAct 패턴",
    },
    {
      id: "b4",
      type: "paragraph",
      text: "Reasoning + Acting의 약자. LLM이 생각(Thought) → 행동(Action) → 관찰(Observation)을 반복하며 문제를 해결합니다. 구현이 단순하고 단계별 추론을 볼 수 있다는 장점이 있습니다.",
    },
    {
      id: "b5",
      type: "heading_2",
      text: "Plan-and-Execute 패턴",
    },
    {
      id: "b6",
      type: "paragraph",
      text: "먼저 전체 계획을 수립(Plan)한 뒤 단계별로 실행(Execute)합니다. 복잡한 멀티스텝 태스크에서 더 안정적이며, 계획 수립 단계에서 사용자 확인을 받을 수 있습니다.",
    },
    {
      id: "b7",
      type: "numbered_list_item",
      text: "Planner LLM이 태스크를 하위 단계로 분해",
    },
    {
      id: "b8",
      type: "numbered_list_item",
      text: "Executor가 각 단계를 도구 호출로 수행",
    },
    {
      id: "b9",
      type: "numbered_list_item",
      text: "결과를 취합해 최종 응답 생성",
    },
  ],
  "llm-ops-cost-latency-quality": [
    {
      id: "b1",
      type: "heading_1",
      text: "프로덕션 LLM 운영의 현실",
    },
    {
      id: "b2",
      type: "paragraph",
      text: "LLM 서비스를 프로덕션에 올리면 개발 단계에서 보이지 않던 문제들이 드러납니다. 비용·지연·품질 세 축이 서로 긴장 관계에 있어 어느 하나를 최적화하면 다른 하나가 나빠집니다.",
    },
    {
      id: "b3",
      type: "heading_2",
      text: "비용 최적화 전략",
    },
    {
      id: "b4",
      type: "bulleted_list_item",
      text: "프롬프트 캐싱(Prompt Caching): 반복되는 시스템 프롬프트를 캐시해 입력 토큰 비용 절감",
    },
    {
      id: "b5",
      type: "bulleted_list_item",
      text: "모델 라우팅: 쉬운 태스크는 소형 모델, 복잡한 태스크만 대형 모델로",
    },
    {
      id: "b6",
      type: "bulleted_list_item",
      text: "배치 처리: 실시간 불필요한 요청은 Batch API로 50% 비용 절감",
    },
    {
      id: "b7",
      type: "heading_2",
      text: "모니터링 설정",
    },
    {
      id: "b8",
      type: "paragraph",
      text: "Langfuse 또는 LangSmith를 붙여 각 LLM 호출의 토큰 수·지연·비용·품질 점수를 추적합니다. 품질 이슈가 발생했을 때 어느 단계에서 무슨 입력이 들어갔는지 역추적할 수 있어야 합니다.",
    },
  ],
};

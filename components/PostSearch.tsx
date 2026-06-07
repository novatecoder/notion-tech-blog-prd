"use client";

import { useState } from "react";
import PostCard from "@/components/PostCard";
import type { Post } from "@/types/post";

interface PostSearchProps {
  posts: Post[];
}

// 클라이언트 측 간단 검색 — 제목·요약·카테고리·태그를 대상으로 필터.
// 글 목록은 서버에서 미리 받아 props로 전달(토큰 클라이언트 미노출).
export default function PostSearch({ posts }: PostSearchProps) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = q
    ? posts.filter((p) =>
        [p.title, p.summary, p.category, ...p.tags]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
    : posts;

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="제목·요약·태그 검색…"
        className="w-full mb-6 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          “{query}”에 대한 검색 결과가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

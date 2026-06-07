import { getPublishedPosts, getCategories } from "@/lib/notion";
import CategoryFilter from "@/components/CategoryFilter";
import PostSearch from "@/components/PostSearch";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">최신 글</h1>
        <p className="text-gray-500">
          LLM 애플리케이션 개발·에이전트·RAG·운영 노하우
        </p>
      </div>

      <CategoryFilter categories={categories} />

      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          아직 발행된 글이 없습니다.
        </div>
      ) : (
        <PostSearch posts={posts} />
      )}
    </div>
  );
}

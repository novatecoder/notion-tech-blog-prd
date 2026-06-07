import { getPublishedPosts } from "@/lib/notion";
import PostCard from "@/components/PostCard";

export const revalidate = 60;

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">최신 글</h1>
        <p className="text-gray-500">
          LLM 애플리케이션 개발·에이전트·RAG·운영 노하우
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          아직 발행된 글이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

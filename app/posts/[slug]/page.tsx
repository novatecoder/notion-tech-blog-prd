import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/notion";
import { renderBlocks } from "@/lib/render-blocks";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostBySlug(slug);
  if (!result) return { title: "글을 찾을 수 없습니다" };
  return {
    title: result.post.title,
    description: result.post.summary,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const result = await getPostBySlug(slug);

  if (!result) {
    notFound();
  }

  const { post, blocks } = result;

  const formattedDate = post.published
    ? new Date(post.published).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.category && (
            <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
              {post.category}
            </span>
          )}
          {formattedDate && (
            <span className="text-sm text-gray-400">{formattedDate}</span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {post.summary && (
          <p className="text-lg text-gray-500 leading-relaxed">{post.summary}</p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <hr className="border-gray-200 mb-8" />

      <div className="prose-content">
        {renderBlocks(blocks)}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <a
          href="/"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← 글 목록으로 돌아가기
        </a>
      </div>
    </article>
  );
}

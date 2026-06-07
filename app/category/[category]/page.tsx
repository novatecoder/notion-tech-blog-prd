import { getPublishedPosts, getCategories } from "@/lib/notion";
import PostCard from "@/components/PostCard";
import CategoryFilter from "@/components/CategoryFilter";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category: encodeURIComponent(category) }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);

  const [allPosts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);

  if (!categories.includes(decoded)) notFound();

  const posts = allPosts.filter((p) => p.category === decoded);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{decoded}</h1>
        <p className="text-gray-500">{posts.length}개의 글</p>
      </div>

      <CategoryFilter categories={categories} active={decoded} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

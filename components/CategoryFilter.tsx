import Link from "next/link";

interface CategoryFilterProps {
  categories: string[];
  active?: string;
}

// 카테고리 필터 바 — 홈/카테고리 페이지 공통. 클릭 시 /category/[category]로 이동.
export default function CategoryFilter({ categories, active }: CategoryFilterProps) {
  if (categories.length === 0) return null;

  const base = "text-sm px-3 py-1 rounded-full border transition-colors";
  const activeCls = "bg-blue-600 text-white border-blue-600";
  const idleCls = "border-gray-200 text-gray-600 hover:border-gray-300";

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link href="/" className={`${base} ${!active ? activeCls : idleCls}`}>
        전체
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/category/${encodeURIComponent(category)}`}
          className={`${base} ${active === category ? activeCls : idleCls}`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}

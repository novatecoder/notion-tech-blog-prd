import type { Post, Block } from "@/types/post";
import { samplePosts, sampleBlocks } from "@/lib/sample-data";

// Notion API는 서버 전용 — 'use client' 금지
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

function hasNotionCredentials(): boolean {
  return Boolean(NOTION_TOKEN && NOTION_DATABASE_ID);
}

// Notion 속성에서 rich_text 추출 헬퍼
function getRichText(prop: Record<string, unknown> | undefined): string {
  if (!prop) return "";
  const richText = prop.rich_text as Array<{ plain_text: string }> | undefined;
  if (!Array.isArray(richText)) return "";
  return richText.map((t) => t.plain_text).join("");
}

// Notion 페이지 속성 → Post 변환
function notionPageToPost(page: Record<string, unknown>): Post | null {
  try {
    const props = page.properties as Record<string, Record<string, unknown>>;
    const titleArr = (
      props?.Title?.title as Array<{ plain_text: string }> | undefined
    ) ?? [];
    const title = titleArr.map((t) => t.plain_text).join("").trim();
    if (!title) return null;

    const slug =
      getRichText(props?.Slug) ||
      title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    const category =
      (props?.Category?.select as { name: string } | null)?.name ?? "";

    const tags = (
      (props?.Tags?.multi_select as Array<{ name: string }>) ?? []
    ).map((t) => t.name);

    const summary = getRichText(props?.Summary);

    const publishedDate = (props?.Published?.date as { start: string } | null)
      ?.start;
    const published = publishedDate ?? "";

    const status =
      ((props?.Status?.select as { name: string } | null)?.name as
        | "발행됨"
        | "초안") ?? "초안";

    const coverFiles = page.cover as
      | { type: string; external?: { url: string }; file?: { url: string } }
      | null;
    const cover =
      coverFiles?.external?.url ?? coverFiles?.file?.url ?? undefined;

    return {
      id: page.id as string,
      title,
      slug,
      category,
      tags,
      summary,
      published,
      status,
      cover,
    };
  } catch {
    return null;
  }
}

// Notion 블록 → Block 변환
function notionBlockToBlock(block: Record<string, unknown>): Block | null {
  const type = block.type as string;
  const blockData = block[type] as
    | Record<string, unknown>
    | undefined;

  if (!blockData) return null;

  const richText = blockData.rich_text as
    | Array<{ plain_text: string }>
    | undefined;
  const text = richText?.map((t) => t.plain_text).join("") ?? "";

  if (
    type === "paragraph" ||
    type === "heading_1" ||
    type === "heading_2" ||
    type === "heading_3" ||
    type === "bulleted_list_item" ||
    type === "numbered_list_item"
  ) {
    return { id: block.id as string, type, text };
  }

  if (type === "code") {
    const language = (blockData.language as string) ?? "plain text";
    return { id: block.id as string, type, text, language };
  }

  if (type === "image") {
    const imageData = blockData as {
      type: string;
      external?: { url: string };
      file?: { url: string };
      caption?: Array<{ plain_text: string }>;
    };
    const url =
      imageData.external?.url ?? imageData.file?.url ?? "";
    const caption =
      imageData.caption?.map((c) => c.plain_text).join("") ?? "";
    return { id: block.id as string, type, url, caption };
  }

  // 미지원 블록은 null 반환 → graceful 무시
  return null;
}

export async function getPublishedPosts(): Promise<Post[]> {
  if (!hasNotionCredentials()) {
    return samplePosts.filter((p) => p.status === "발행됨");
  }

  try {
    const { Client } = await import("@notionhq/client");
    const notion = new Client({ auth: NOTION_TOKEN });

    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID!,
      filter: {
        property: "Status",
        select: { equals: "발행됨" },
      },
      sorts: [{ property: "Published", direction: "descending" }],
    });

    const posts = response.results
      .map((page) => notionPageToPost(page as Record<string, unknown>))
      .filter((p): p is Post => p !== null);

    return posts;
  } catch (error) {
    console.error("[notion] getPublishedPosts 실패, 샘플 데이터로 fallback:", error);
    return samplePosts.filter((p) => p.status === "발행됨");
  }
}

export async function getPostBySlug(
  slug: string
): Promise<{ post: Post; blocks: Block[] } | null> {
  if (!hasNotionCredentials()) {
    const post = samplePosts.find((p) => p.slug === slug && p.status === "발행됨");
    if (!post) return null;
    const blocks = sampleBlocks[slug] ?? [];
    return { post, blocks };
  }

  try {
    const { Client } = await import("@notionhq/client");
    const notion = new Client({ auth: NOTION_TOKEN });

    // slug로 페이지 검색
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID!,
      filter: {
        and: [
          { property: "Slug", rich_text: { equals: slug } },
          { property: "Status", select: { equals: "발행됨" } },
        ],
      },
    });

    if (response.results.length === 0) return null;

    const page = response.results[0];
    const post = notionPageToPost(page as Record<string, unknown>);
    if (!post) return null;

    // 본문 블록 fetch
    const blocksResponse = await notion.blocks.children.list({
      block_id: page.id,
    });

    const blocks = blocksResponse.results
      .map((b) => notionBlockToBlock(b as Record<string, unknown>))
      .filter((b): b is Block => b !== null);

    return { post, blocks };
  } catch (error) {
    console.error("[notion] getPostBySlug 실패, 샘플 데이터로 fallback:", error);
    const post = samplePosts.find((p) => p.slug === slug && p.status === "발행됨");
    if (!post) return null;
    const blocks = sampleBlocks[slug] ?? [];
    return { post, blocks };
  }
}

import type { Block } from "@/types/post";
import Image from "next/image";

export function renderBlocks(blocks: Block[]): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let numberedCount = 0;

  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
        numberedCount = 0;
        nodes.push(
          <p key={block.id} className="my-4 leading-relaxed text-gray-700">
            {block.text}
          </p>
        );
        break;

      case "heading_1":
        numberedCount = 0;
        nodes.push(
          <h1
            key={block.id}
            className="mt-8 mb-4 text-3xl font-bold text-gray-900"
          >
            {block.text}
          </h1>
        );
        break;

      case "heading_2":
        numberedCount = 0;
        nodes.push(
          <h2
            key={block.id}
            className="mt-6 mb-3 text-2xl font-semibold text-gray-900"
          >
            {block.text}
          </h2>
        );
        break;

      case "heading_3":
        numberedCount = 0;
        nodes.push(
          <h3
            key={block.id}
            className="mt-5 mb-2 text-xl font-semibold text-gray-800"
          >
            {block.text}
          </h3>
        );
        break;

      case "bulleted_list_item":
        numberedCount = 0;
        nodes.push(
          <li key={block.id} className="ml-6 my-1 list-disc text-gray-700">
            {block.text}
          </li>
        );
        break;

      case "numbered_list_item":
        numberedCount += 1;
        nodes.push(
          <li key={block.id} className="ml-6 my-1 list-decimal text-gray-700">
            {block.text}
          </li>
        );
        break;

      case "code":
        numberedCount = 0;
        nodes.push(
          <div key={block.id} className="my-4">
            {block.language && block.language !== "plain text" && (
              <div className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-t font-mono">
                {block.language}
              </div>
            )}
            <pre
              className={`bg-gray-800 text-green-300 p-4 overflow-x-auto font-mono text-sm ${
                block.language && block.language !== "plain text"
                  ? "rounded-b"
                  : "rounded"
              }`}
            >
              <code>{block.text}</code>
            </pre>
          </div>
        );
        break;

      case "image":
        numberedCount = 0;
        if (block.url) {
          nodes.push(
            <figure key={block.id} className="my-6">
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src={block.url}
                  alt={block.caption ?? "이미지"}
                  fill
                  className="object-contain rounded"
                />
              </div>
              {block.caption && (
                <figcaption className="text-center text-sm text-gray-500 mt-2">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }
        break;

      default:
        // 미지원 블록은 graceful 무시
        numberedCount = 0;
        break;
    }
  }

  return nodes;
}

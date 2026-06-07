export interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  summary: string;
  published: string; // ISO date string
  status: "발행됨" | "초안";
  cover?: string;
}

export interface Block {
  id: string;
  type:
    | "paragraph"
    | "heading_1"
    | "heading_2"
    | "heading_3"
    | "bulleted_list_item"
    | "numbered_list_item"
    | "code"
    | "image"
    | string;
  text?: string;
  language?: string; // for code blocks
  url?: string; // for image blocks
  caption?: string; // for image blocks
}

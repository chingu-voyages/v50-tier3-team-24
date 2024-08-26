import type { EditorJsBlock } from "./editjs-block";
export interface AnnoteDocument {
  document_id: string;
  user_id: string; // This is the foreign key that refers to the user
  slug: string; // Refers to the document slug
  title: string;
  blocks: EditorJsBlock[];
  description: string;
  created_at: Date;
  updated_at: Date;
  source_url?: string;
  image_url?: string;
  author?: string;
  visibility: "private" | "public";
}

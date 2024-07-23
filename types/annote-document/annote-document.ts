export interface AnnoteDocument {
  document_id: number;
  user_id: number; // This is the foreign key that refers to the user
  slug: string; // Refers to the document slug
  title: string;
  body: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  source_url?: string;
  image_url?: string;
  visibility: "private" | "public";
}

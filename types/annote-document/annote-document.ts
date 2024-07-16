export interface AnnoteDocument {
  id: string;
  userId: string; // This is the foreign key that refers to the user
  slug: string; // Refers to the document slug
  title: string;
  body: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  sourceUrl?: string;
  imageUrl?: string;
  visibility: "private" | "public";
}

export interface AnnoteDocument {
  id: string;
  userId: string;
  path: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  sourceUrl?: string;
  visibility: "private" | "public";
}

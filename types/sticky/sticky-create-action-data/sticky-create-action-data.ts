export interface StickyCreateActionData {
  document_id: string;
  title: string;
  body: string;
  color: string;
  anchor: number;
  sticky_type: "sticky" | "video" | "link";
}

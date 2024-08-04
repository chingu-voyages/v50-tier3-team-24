export interface StickyCreateActionData {
  sticky_id: string;
  document_id: string;
  title: string;
  body: string;
  color: string;
  anchor: number;
  sticky_type: "sticky" | "video" | "link";
  source_url?: string;
}

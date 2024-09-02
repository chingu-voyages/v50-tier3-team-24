interface BaseStickyActionData {
  document_id: string;
  title: string;
  body: string;
  color: string;
  anchor: number;
  sticky_type: "sticky" | "video" | "link";
  source_url?: string;
  author: string;
}

export interface StickyUpdateActionData extends BaseStickyActionData {}
export interface StickyCreateActionData extends BaseStickyActionData {
  sticky_id: string;
}

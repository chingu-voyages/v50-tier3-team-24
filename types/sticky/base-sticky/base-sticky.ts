// This is just a base. Use Sticky, VideoSticky, and LinkSticky instead.
export interface BaseSticky {
  sticky_id: string;
  document_id: string;
  title: string;
  body: string;
  anchor: number;
  created_at: Date;
  updated_at: Date;
  sticky_type: "sticky" | "video" | "link";
}

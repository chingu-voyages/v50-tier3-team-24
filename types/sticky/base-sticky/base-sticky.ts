// This is just a base. Use Sticky, VideoSticky, and LinkSticky instead.
export interface BaseSticky {
  author?: string;
  sticky_id: string;
  document_id: string;
  user_id: string;
  title: string;
  body: string;
  anchor: number;
  created_at: Date;
  updated_at: Date;
  sticky_type: "sticky" | "video" | "link";
  color: string;
}

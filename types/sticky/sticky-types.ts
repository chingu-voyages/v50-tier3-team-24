import type { BaseSticky } from "./base-sticky/base-sticky";

export interface Sticky extends BaseSticky {}

interface StickyWithSourceUrl extends BaseSticky {
  source_url: string;
}
export interface VideoSticky extends StickyWithSourceUrl {
  video_title: string;
  video_description: string;
  video_thumbnail: string;
}

export interface LinkSticky extends StickyWithSourceUrl {
  page_title: string;
  page_description: string;
  page_thumbnail: string;
}

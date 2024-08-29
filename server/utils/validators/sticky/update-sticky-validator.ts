import { object, string } from "yup";
import type { StickyUpdateActionData } from "~/types/sticky/sticky-action-data/sticky-action-data";

export const updateStickyValidator = object<StickyUpdateActionData>({
  document_id: string().required(),
  title: string().optional(),
  body: string().optional(),
  color: string().optional(),
  anchor: string().required(),
  sticky_type: string().optional(),
  source_url: string().notRequired(),
});

import { object, string } from "yup";
import type { StickyUpdateActionData } from "~/types/sticky/sticky-action-data/sticky-action-data";

export const updateStickyValidator = object<StickyUpdateActionData>({
  document_id: string().required(),
  title: string().required(),
  body: string().required(),
  color: string().required(),
  anchor: string().required(),
  sticky_type: string().required(),
  source_url: string().notRequired(),
});

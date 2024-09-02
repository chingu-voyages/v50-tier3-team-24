import { object, string } from "yup";
import type { StickyCreateActionData } from "~/types/sticky/sticky-action-data/sticky-action-data";

export const createStickyValidator = object<StickyCreateActionData>({
  document_id: string().required(),
  title: string().required(),
  body: string().required(),
  color: string().required(),
  anchor: string().required(),
  sticky_type: string().required(),
  source_url: string().notRequired(),
  author: string().required(),
  sticky_id: string()
    .required()
    .length(36, "Sticky ID must be uuid and 36 characters long."),
});

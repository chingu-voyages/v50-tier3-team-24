import { array, object, string } from "yup";

export const createDocumentValidator = object({
  title: string().required(),
  blocks: array().of(
    object({
      id: string().required(),
      type: string().required(),
      data: object().required(),
    })
  ),
  description: string().optional(),
  source_url: string().url().optional(),
});

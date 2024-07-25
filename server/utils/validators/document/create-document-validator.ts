import { object, string } from "yup";

export const createDocumentValidator = object({
  title: string().required(),
  body: string().required(),
  description: string().optional(),
  source_url: string().url().optional(),
});

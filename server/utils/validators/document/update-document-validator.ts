import { array, object, string } from "yup";
export const updateDocumentValidator = object({
  title: string()
    .test(
      "title",
      "Title must be the only parameter in this request. The request body cannot be empty.",
      (value, context) => {
        if (value && context.parent.blocks) return false;
        if (!value && !context.parent.blocks && !context.parent.visibility)
          return false;

        return true;
      }
    )
    .optional(),
  blocks: array().of(
    object({
      id: string().required(),
      type: string().required(),
      data: object().required(),
    }).test(
      "blocks",
      "blocks field must be the only parameter in this request. The request body cannot be empty.",
      (value, context) => {
        if (value && context.parent.title) return false;
        if (!value && !context.parent.title && !context.parent.visibility)
          return false;
        return true;
      }
    )
  ),
  visibility: string().oneOf(["public", "private"]).optional(),
});

import { object, string } from "yup";
export const updateDocumentValidator = object({
  title: string().test(
    "title",
    "Title must be the only parameter in this request. The request body cannot be empty.",
    (value, context) => {
      if (value && context.parent.body) return false;
      if (!value && !context.parent.body) return false;

      return true;
    }
  ),
  body: string().test(
    "body",
    "body must be the only parameter in this request. The request body cannot be empty.",
    (value, context) => {
      if (value && context.parent.title) return false;
      if (!value && !context.parent.title) return false;
      return true;
    }
  ),
});

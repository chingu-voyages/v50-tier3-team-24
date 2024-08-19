import { object, string } from "yup";
import { validateUrl } from "~/utils/web-scraper/validators/url-validator";
export const webScraperValidator = object({
  url: string()
    .required()
    .test("url", "Invalid URL", (value) => {
      return validateUrl(value);
    }),
});

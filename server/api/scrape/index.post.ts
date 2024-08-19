import { HtmlToBlockMapper } from "#imports";
import { serverSupabaseUser } from "#supabase/server";
import { getSelectorsByHostName } from "~/server/utils/html-extractor/hostnames";
import { HtmlExtractor } from "~/server/utils/html-extractor/html-extractor";
import { webScraperValidator } from "~/server/utils/validators/web-scraper/web-scraper-validator";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    setResponseStatus(event, 401);
    return {
      status: "fail",
      error: createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      }),
    };
  }

  const requestBody = await readBody<{ url: string }>(event);

  try {
    // Validate the request
    await webScraperValidator.validate(requestBody, { abortEarly: false });
  } catch (error: any) {
    setResponseStatus(event, 400);
    return {
      status: "fail",
      error: createError({
        statusCode: 400,
        statusMessage: error.message,
      }),
    };
  }

  const { url } = requestBody;
  try {
    // Scrape the URL
    const content = await WebScraper.scrape(url);
    const hostName = new URL(url).hostname;

    // Extract the article content, covert it to an array of ArticleContent
    // Map the ArticleContent to EditorJS blocks and return a response

    return {
      status: "ok",
      data: new HtmlToBlockMapper(hostName).map(
        new HtmlExtractor(content).extract(getSelectorsByHostName(hostName))
      ),
    };
  } catch (error: any) {
    return {
      status: "fail",
      error: createError({
        statusCode: 500,
        statusMessage: error.message,
      }),
    };
  }
});

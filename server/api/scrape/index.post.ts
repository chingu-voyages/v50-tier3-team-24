import { HtmlToBlockMapper } from "#imports";
import { getSelectorsByHostName } from "~/server/utils/html-extractor/hostnames";
import { HtmlExtractor } from "~/server/utils/html-extractor/html-extractor";

export default defineEventHandler(async (event) => {
  const requestBody = await readBody<{ url: string }>(event);
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

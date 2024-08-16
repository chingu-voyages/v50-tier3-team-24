import { HtmlExtractor } from "~/server/utils/html-extractor/html-extractor";

export default defineEventHandler(async (event) => {
  const requestBody = await readBody<{ url: string }>(event);
  const { url } = requestBody;
  try {
    // Scrape the URL
    const content = await WebScraper.scrape(url);

    // Extract the article content, covert it to an array of ArticleContent
    // Map the ArticleContent to EditorJS blocks and return a response
    return {
      status: "ok",
      data: new HtmlToBlockMapper().map(new HtmlExtractor(content).extract()),
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

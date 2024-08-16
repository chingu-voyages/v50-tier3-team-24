import { HtmlExtractor } from "~/server/utils/html-extractor/html-extractor";

export default defineEventHandler(async (event) => {
  const requestBody = await readBody<{ url: string }>(event);
  const { url } = requestBody;
  try {
    // Scrape the URL
    const content = await WebScraper.scrape(url);

    // Extract the article content, covert it to an array of ArticleContent
    const extractor = new HtmlExtractor(content);
    const articleHtmlContent = extractor.extract();

    // Map the ArticleContent to EditorJS blocks
    const htmlToBlockMapper = new HtmlToBlockMapper();
    const mappedContent = htmlToBlockMapper.map(articleHtmlContent);

    return { status: "ok", data: mappedContent };
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

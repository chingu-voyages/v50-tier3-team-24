export const WebScraper = {
  scrape: async (url: string): Promise<string> => {
    try {
      const content = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
          "Accept-Language": "en-CA,en-US;q=0.7,en;q=0.3",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-User": "?1",
          Priority: "u=0, i",
        },
      });
      return await content.text();
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

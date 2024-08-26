export const WebScraper = {
  scrape: async (url: string): Promise<string> => {
    try {
      const content = await fetch(url);
      return await content.text();
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

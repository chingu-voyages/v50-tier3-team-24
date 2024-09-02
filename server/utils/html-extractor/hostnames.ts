// For each domain, sometimes there needs to be some custom selector to extract the article text.
// The intent of this shouldn't be something that's exhaustive. It's just a sample of customization.
const HOST_NAMES: Record<string, string[]> = {
  "serpapi.com": ["article"],
  "css-tricks.com": [".article-content"],
  "timesofindia.indiatimes.com": ["[data-articlebody]"],
  "www.timesofisrael.com": ["#main-content"],
  "docs.python.org": [".body"],
  "constitutioncenter.org": [".container article"],
  "www.japantimes.co.jp": ["#jtarticle"],
  "www.nbcnews.com": [".article-body"],
  "www.cp24.com": [".articleBody"],
};

export const getSelectorsByHostName = (hostName: string): string[] => {
  const selectors = HOST_NAMES[hostName];

  if (selectors) {
    return selectors;
  }

  console.warn(
    `No selectors found for ${hostName}, defaulting to selector 'main'`
  );
  return ["main"]; // We can probably do some default selector here
};

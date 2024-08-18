// Get the correct method to extract hostnames from a HTML string

// The intent of this shouldn't be something that's exhaustive. It's just a sample of customization.
const HOST_NAMES: Record<string, string[]> = {
  article: ["serpapi.com"],
  ".article-content": ["css-tricks.com"],
  "[data-articlebody]": ["timesofindia.indiatimes.com"],
  "#main-content": ["www.timesofisrael.com"],
  ".body": ["docs.python.org"],
  ".container article": ["constitutioncenter.org"],
};

export const getSelectorByHostName = (hostName: string): string[] => {
  const selectors: string[] = [];
  for (const selector in HOST_NAMES) {
    if (HOST_NAMES[selector].includes(hostName)) {
      selectors.push(selector);
    }
  }

  if (selectors.length > 0) {
    return selectors;
  }

  console.warn(
    `No selector found for ${hostName}, defaulting to selector 'main'`
  );
  return ["main"]; // We can probably do some default selector here
};

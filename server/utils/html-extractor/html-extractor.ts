// Take the raw HTML and extract the data we need
import parser, { HTMLElement } from "node-html-parser";
import { ArticleContent, HTMLTextElement } from "./definitions";

export class HtmlExtractor {
  private root: HTMLElement | null = null;
  private articleContent: ArticleContent[] = [];

  constructor(html: string) {
    this.root = parser.parse(html);
    if (!this.root) {
      throw new Error("Failed to parse HTML");
    }
  }

  public extract(): ArticleContent[] {
    // Extrating the main content of the article seems straight forward and consistent across websites
    this.extractTitle();

    // This step is tricker because websites organize the content differently. Maybe we can use a plug-in or an adapter
    // to extract the main content of the article depending on the website?

    return [
      ...this.articleContent,
      ...this.extractByMain(),
      ...this.extractByArticle(),
    ];
  }

  private extractTitle(): void {
    // Extract the main article title. This appears to be consistent across all articles?
    const title = this.root?.querySelector("h1");
    if (title) {
      this.articleContent.push({
        contentType: "h1",
        content: sanitizeText(title.text),
      });
    }
  }

  private extractByArticle(): ArticleContent[] {
    // Let's try `article` tag first
    const article = this.root?.querySelector("article");
    const accumulator: ArticleContent[] = [];
    if (article) {
      this.recursivelyTraverseHtmlElements(article, accumulator);
    }
    return accumulator;
  }

  // This is generally good for news websites (wapo, nytimes, etc)
  private extractByMain(): ArticleContent[] {
    // Let's try `main` tag first
    const main = this.root?.querySelector("main");
    const accumulator: ArticleContent[] = [];
    if (main) {
      this.recursivelyTraverseHtmlElements(main, accumulator);
    }
    return accumulator;
  }

  private recursivelyTraverseHtmlElements(
    element: HTMLElement,
    accumulator?: ArticleContent[]
  ): void {
    const extractedElement = this.extractTraversedElement(element);
    if (extractedElement && accumulator) {
      accumulator.push(extractedElement);
    }

    element.childNodes.forEach((child) => {
      if (child instanceof HTMLElement) {
        this.recursivelyTraverseHtmlElements(child, accumulator);
      }
    });
  }

  private extractTraversedElement(
    element?: HTMLElement
  ): ArticleContent | null {
    if (!element) return null;
    const valideHtmlTags: HTMLTextElement[] = [
      "p",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "div",
    ];

    if (valideHtmlTags.includes(element.rawTagName as any)) {
      if (element.text?.trim() === "") return null;
      return {
        contentType: element.rawTagName as HTMLTextElement,
        content: sanitizeText(element.text),
      };
    }
    return null;
  }
}

const sanitizeText = (input: string): string => {
  return input.replace(/[\t\n\r]/gm, "").trim();
};

// Take the raw string HTML and use the node-html-parser library to create an HTML structure from which we can query elements.
import parser, { HTMLElement } from "node-html-parser";
import { ArticleContent, HTMLTextElement } from "./definitions";

export class HtmlExtractor {
  private root: HTMLElement | null = null;
  private articleContent: ArticleContent[] = [];

  constructor(html: string) {
    this.root = parser.parse(html, {
      blockTextElements: {
        script: false,
        noscript: false,
        style: false,
      },
    });
    if (!this.root) {
      throw new Error("Failed to parse HTML");
    }
  }

  public extract(selectors: string[]): ArticleContent[] {
    // Extrating the main content of the article seems straight forward and consistent across websites
    this.extractTitle();
    return [...this.articleContent].concat(
      ...selectors.map((selector) => this.extractBySelector(selector))
    );
  }

  private extractTitle(): void {
    // Extract the main article title. This extraction appears to be consistent across all articles.
    const title = this.root?.querySelector("h1");
    if (title) {
      this.articleContent.push({
        contentType: "h1",
        content: sanitizeText(title.text),
      });
    }
  }

  private extractBySelector(selector: string): ArticleContent[] {
    const htmlElement = this.root?.querySelector(selector);

    if (!htmlElement) {
      console.error("No elements found for selector:", selector);
    }
    const accumulator: ArticleContent[] = [];
    if (htmlElement) {
      this.recursivelyTraverseHtmlElements(htmlElement, accumulator);
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
    const validHtmlTags: string[] = [
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

    if (validHtmlTags.includes(element.rawTagName as any)) {
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

import {
  EditorJsBlock,
  EditorJsBlockType,
  HeaderLevel,
} from "~/types/annote-document/editjs-block";
import { ArticleContent, HTMLTextElement } from "../html-extractor/definitions";

// This class maps the array of ArticleContent as outputted from the html-extract EditorJS blocks
export class HtmlToBlockMapper {
  private hostName: string;

  constructor(hostName: string) {
    this.hostName = hostName;
    console.info("hostName:", this.hostName);
  }

  public map(articleContent: ArticleContent[]): EditorJsBlock[] {
    // This 'directory' basically tells the mapper how to map each HTML element to an EditorJS block
    const directory: Record<HTMLTextElement, Function> = {
      h1: this.mapHeader,
      h2: this.mapHeader,
      h3: this.mapHeader,
      h4: this.mapHeader,
      h5: this.mapHeader,
      h6: this.mapHeader,
      p: this.mapParagraph,
      ul: this.mapList,
      ol: this.mapList,
      div: this.getCustomDivMapper(),
      li: () => null,
    };

    const blocks: EditorJsBlock[] = [];
    console.info("articleContent:", articleContent);
    articleContent.forEach((content, index) => {
      if (content.contentType === "ul" || content.contentType === "ol") {
        // HTML List elements need to be treated slightly differently given that the articleContent comes to this function as flattened
        // Theoretically how I've parsed the articleContent, <li> elements should directly follow <ul> or <ol> elements.
        blocks.push(
          directory[content.contentType](
            content,
            articleContent.slice(index + 1) // Splice the array to get the next elements in the list. They will be used to create <li> if they exist
          )
        );
      } else {
        blocks.push(directory[content.contentType](content));
      }
    });
    return blocks.filter((block) => block !== null);
  }

  private mapHeader(articleContent: ArticleContent): EditorJsBlock {
    return {
      type: EditorJsBlockType.Header,
      data: {
        text: articleContent.content,
        level: getHeaderLevel(articleContent.contentType) as HeaderLevel,
      },
    };
  }

  private mapParagraph(articleContent: ArticleContent): EditorJsBlock {
    return {
      type: EditorJsBlockType.Paragraph,
      data: {
        text: articleContent.content,
      },
    };
  }

  private mapList(
    articleContent: ArticleContent,
    section: ArticleContent[]
  ): EditorJsBlock {
    const listItems: string[] = [];

    // Look for contiguous <li> elements. As soon as it's not an li, break and return
    for (let item of section) {
      if (item.contentType !== "li") break;
      listItems.push(item.content);
    }

    return {
      type: EditorJsBlockType.List,
      data: {
        style: articleContent.contentType === "ul" ? "unordered" : "ordered",
        items: listItems,
      },
    };
  }

  private getCustomDivMapper(): Function {
    switch (this.hostName) {
      case "timesofindia.indiatimes.com":
      case "css-tricks.com":
        return this.mapParagraph;
      default:
        return () => null;
    }
  }
}

function getHeaderLevel(contentType: string): number {
  return parseInt(contentType[1]);
}

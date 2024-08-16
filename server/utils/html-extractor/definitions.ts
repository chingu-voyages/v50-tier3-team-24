export type HTMLTextElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "ul"
  | "ol"
  | "li"
  | "div";

// TODO: Find a way to handle simple tables. For now, we'll ignore them
export type ArticleContent = {
  contentType: HTMLTextElement;
  content: string;
};

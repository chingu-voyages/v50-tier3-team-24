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

export type ArticleContent = {
  contentType: HTMLTextElement;
  content: string;
};

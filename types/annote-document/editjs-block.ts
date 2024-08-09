export interface HeaderData extends BasicTextData {}

interface BasicTextData {
  text: string;
}
export interface ParagraphData extends BasicTextData {}

export interface MarkerData extends BasicTextData {}

export interface ListData {
  style: "ordered" | "unordered";
  items: string[];
}
export enum EditorJsBlockType {
  Header = "header",
  Paragraph = "paragraph",
  List = "list",
}

export type AnyBlockType = HeaderData | ParagraphData | MarkerData;
export interface EditorJsBlock {
  type: EditorJsBlockType;
  data: AnyBlockType | ListData;
}

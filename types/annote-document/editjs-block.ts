export interface HeaderData extends BasicTextData {
  level: HeaderLevel;
}

export type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;
interface BasicTextData {
  text: string;
}
export interface ParagraphData extends BasicTextData {}

export interface MarkerData extends BasicTextData {}

export interface LinkToolData {
  link: string;
  meta?: Object;
}

export interface ListData {
  style: "ordered" | "unordered";
  items: string[];
}
export enum EditorJsBlockType {
  Header = "header",
  Paragraph = "paragraph",
  List = "list",
  LinkTool = "linkTool",
}

export type AnyBlockType = HeaderData | ParagraphData | MarkerData;
export interface EditorJsBlock {
  type: EditorJsBlockType;
  data: AnyBlockType | ListData | LinkToolData;
  id?: string;
}

export type DataRect = {
  columnStart: number;
  columnEnd: number;
  rowStart: number;
  rowEnd: number;
};

export type Section =
  | "top-start"
  | "top-center"
  | "top-end"
  | "center-start"
  | "center-center"
  | "center-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end";

export type SectionedRect = DataRect & {
  section: Section;
};

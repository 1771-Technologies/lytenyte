export interface CellSelectionRect {
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly columnStart: number;
  readonly columnEnd: number;
}

export type CellSelectionMode = "single" | "range" | "multi-range" | "none";

// Additional
export type CellSelectionRectPro = CellSelectionRect;
export type CellSelectionModePro = CellSelectionMode;

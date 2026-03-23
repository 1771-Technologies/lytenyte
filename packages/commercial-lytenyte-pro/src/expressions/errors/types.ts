export interface SourcePosition {
  line: number;
  column: number;
  offset: number;
}

export interface ErrorLocation {
  source: string;
  start: number;
  end: number;
}

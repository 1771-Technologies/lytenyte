import type { SourcePosition } from "./types.js";
import { clampOffset } from "./clamp-offset.js";

const NEWLINE_CODE = 10;

export function offsetToPosition(source: string, offset: number): SourcePosition {
  const safeOffset = clampOffset(source, offset);
  let line = 1;
  let column = 1;

  for (let index = 0; index < safeOffset; index++) {
    if (source.charCodeAt(index) === NEWLINE_CODE) {
      line++;
      column = 1;
    } else {
      column++;
    }
  }

  return { line, column, offset: safeOffset };
}

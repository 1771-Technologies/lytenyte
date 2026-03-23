import { clampOffset } from "./clamp-offset.js";

const NEWLINE_CODE = 10;

export function getLineStart(source: string, offset: number): number {
  let index = clampOffset(source, offset);
  while (index > 0 && source.charCodeAt(index - 1) !== NEWLINE_CODE) index--;
  return index;
}

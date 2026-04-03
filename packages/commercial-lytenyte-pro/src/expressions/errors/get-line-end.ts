import { clampOffset } from "./clamp-offset.js";

const NEWLINE_CODE = 10;

export function getLineEnd(source: string, offset: number): number {
  let index = clampOffset(source, offset);
  while (index < source.length && source.charCodeAt(index) !== NEWLINE_CODE) index++;
  return index;
}

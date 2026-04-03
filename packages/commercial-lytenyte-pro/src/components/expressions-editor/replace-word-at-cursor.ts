import type { WordAtCursor } from "./types.js";

export function replaceWordAtCursor(
  text: string,
  wordRange: WordAtCursor,
  replacement: string,
): { value: string; cursorPosition: number } {
  const before = text.substring(0, wordRange.start);
  const after = text.substring(wordRange.end);
  const value = before + replacement + after;
  const cursorPosition = wordRange.start + replacement.length;

  return { value, cursorPosition };
}

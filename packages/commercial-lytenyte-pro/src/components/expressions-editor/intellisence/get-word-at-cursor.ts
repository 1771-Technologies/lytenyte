import type { WordAtCursor } from "../types.js";

export function getWordAtCursor(text: string, cursorPosition: number): WordAtCursor {
  const wordPattern = /[a-zA-Z0-9_]/;

  let start = cursorPosition;
  while (start > 0 && wordPattern.test(text[start - 1])) {
    start--;
  }

  return {
    word: text.substring(start, cursorPosition),
    start,
    end: cursorPosition,
  };
}

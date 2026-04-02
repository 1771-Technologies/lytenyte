import { getIndentation } from "./get-indentation.js";

export function handleEnterKey(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  multiline: boolean,
): { value: string; cursorPosition: number } | null {
  if (!multiline) {
    return null;
  }

  const indent = getIndentation(value, selectionStart);
  const insertion = "\n" + indent;
  const newValue = value.substring(0, selectionStart) + insertion + value.substring(selectionEnd);
  const cursorPosition = selectionStart + insertion.length;

  return { value: newValue, cursorPosition };
}

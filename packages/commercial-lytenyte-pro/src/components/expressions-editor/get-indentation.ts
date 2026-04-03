export function getIndentation(text: string, cursorPosition: number): string {
  const textBeforeCursor = text.substring(0, cursorPosition);
  const lines = textBeforeCursor.split("\n");
  const currentLine = lines[lines.length - 1];
  const match = currentLine.match(/^(\s*)/);

  return match ? match[1] : "";
}

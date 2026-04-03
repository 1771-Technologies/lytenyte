import type { ErrorLocation } from "./types.js";
import { clampOffset } from "./clamp-offset.js";
import { getLineStart } from "./get-line-start.js";
import { getLineEnd } from "./get-line-end.js";
import { offsetToPosition } from "./offset-to-position.js";

/** Format an error message with source context, caret display, and position info. */
export function formatError(message: string, location: ErrorLocation, suggestion?: string): string {
  const { source } = location;
  const start = clampOffset(source, location.start);
  const rawEnd = clampOffset(source, location.end);
  const end = Math.max(start + 1, rawEnd);
  const startPos = offsetToPosition(source, start);
  const lineStart = getLineStart(source, start);
  const lineEnd = getLineEnd(source, start);
  const lineText = source.slice(lineStart, lineEnd);
  const caretStart = start - lineStart;
  const caretEnd = Math.min(end, lineEnd);
  const caretLength = Math.max(1, caretEnd - start);
  const gutter = `${startPos.line} | `;
  const padding = " ".repeat(gutter.length + caretStart);
  const carets = "^".repeat(caretLength);

  let result = `${message}\n\n${gutter}${lineText}\n${padding}${carets}`;

  if (suggestion) {
    result += ` Did you mean "${suggestion}"?`;
  }

  result += `\n\nat line ${startPos.line}, column ${startPos.column} (offset ${start}-${end})`;

  return result;
}

import type { ErrorLocation } from "./types.js";
import { formatError } from "./format-error.js";

/** Syntax error thrown during parsing. Contains source location and formatted caret display. */
export class ExpressionError extends Error {
  readonly rawMessage: string;
  readonly start: number;
  readonly end: number;
  readonly source: string;
  readonly suggestion?: string;

  constructor(message: string, location: ErrorLocation, suggestion?: string) {
    const formatted = formatError(message, location, suggestion);
    super(formatted);
    this.name = "ExpressionError";
    this.rawMessage = message;
    this.start = location.start;
    this.end = location.end;
    this.source = location.source;
    this.suggestion = suggestion;
  }
}

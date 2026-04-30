import type { Plugin } from "../plugin.js";
import { scanString } from "../lexer/tokenize/scan-string.js";
import { current, advance } from "../parser/parser-context.js";
import { ExpressionError } from "../errors/expression-error.js";

export const quotedIdentifierPlugin: Plugin = {
  name: "quoted-identifier",

  scan(source, pos) {
    if (source[pos] !== "@") return null;
    const next = source[pos + 1];
    if (next !== '"' && next !== "'") return null;

    try {
      const r = scanString(source, pos + 1);
      // Store the full source text (@"Age Group") so the token overlay renders correctly.
      return { type: "QuotedIdentifier", value: source.slice(pos, r.end), end: r.end };
    } catch (e) {
      // Rethrow with start=pos so the ExpressionError token covers the leading @ character.
      // Without this, scanString reports start at the opening quote (pos+1), leaving @ uncovered.
      if (e instanceof ExpressionError) {
        throw new ExpressionError(e.rawMessage, { source, start: pos, end: e.end });
      }
      throw e;
    }
  },

  parsePrefix(ctx) {
    const tok = current(ctx);
    if (tok.type !== "QuotedIdentifier") return null;

    advance(ctx);
    // Strip the leading @" (or @') and the trailing quote to get the bare identifier name.
    const name = tok.value.slice(2, -1);
    return { type: "Identifier", name, start: tok.start, end: tok.end };
  },
};

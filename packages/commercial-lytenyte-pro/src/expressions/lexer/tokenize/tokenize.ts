import { isDigit } from "../predicates/is-digit.js";
import { isAlpha } from "../predicates/is-alpha.js";
import type { Token } from "../types.js";
import { scanTemplateLiteral } from "./scan-template-literal.js";
import { scanNumber } from "./scan-number.js";
import { scanString } from "./scan-string.js";
import { scanIdentifier } from "./scan-identifier.js";
import { scanOperator } from "./scan-operator.js";
import type { Plugin } from "../../plugin.js";
import { ExpressionError } from "../../errors/expression-error.js";

export function tokenizeSafe(
  source: string,
  plugins?: Plugin[],
): { tokens: Token[]; error: ExpressionError | null } {
  const tokens: Token[] = [];
  try {
    let i = 0;

    while (i < source.length) {
      const ch = source[i];

      if (/\s/.test(ch)) {
        i++;
        continue;
      }

      const start = i;
      let result: { type: string; value: string; end: number } | null = null;

      if (plugins) {
        for (const plugin of plugins) {
          if (plugin.scan) {
            result = plugin.scan(source, i);
            if (result) break;
          }
        }
      }

      if (!result) {
        if (isDigit(ch)) {
          const r = scanNumber(source, i);
          result = { type: "Number", value: r.value, end: r.end };
        } else if (ch === '"' || ch === "'") {
          const r = scanString(source, i);
          result = { type: "String", value: r.value, end: r.end };
        } else if (ch === "`") {
          const r = scanTemplateLiteral(source, i);
          result = { type: "TemplateLiteral", value: r.raw, end: r.end };
        } else if (isAlpha(ch)) {
          result = scanIdentifier(source, i);
        } else {
          result = scanOperator(source, i);
        }
      }

      i = result.end;
      tokens.push({ type: result.type, value: result.value, start, end: i } as Token);
    }

    tokens.push({ type: "EOF", value: "", start: i, end: i });
  } catch (e) {
    if (e instanceof ExpressionError) {
      return { tokens, error: e };
    } else {
      throw e;
    }
  }
  return { tokens, error: null };
}

export function tokenize(source: string, plugins?: Plugin[]): Token[] {
  const result = tokenizeSafe(source, plugins);

  if (result.error) throw result.error;
  return result.tokens;
}

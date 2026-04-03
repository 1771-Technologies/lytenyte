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
  tokensizeWhitespace: boolean = false,
): Token[] {
  const tokens: Token[] = [];
  try {
    let i = 0;

    while (i < source.length) {
      const ch = source[i];

      if (/\s/.test(ch)) {
        if (tokensizeWhitespace) {
          tokens.push({
            value: ch,
            start: i,
            end: i + 1,
            type: "Whitespace",
          });
        }

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
      const error: Token = {
        type: "ExpressionError",
        start: e.start,
        end: e.end,
        value: source.slice(e.start, e.end),
        error: e,
      };
      tokens.push(error);
      const left = source.slice(e.end);
      if (left) {
        const remaining: Token = {
          type: "Unparsed",
          start: e.end,
          end: source.length,
          value: left,
        };

        tokens.push(remaining);
      }
      tokens.push({ type: "EOF", value: "", start: source.length, end: source.length });

      return tokens;
    } else {
      throw e;
    }
  }
  return tokens;
}

export function tokenize(source: string, plugins?: Plugin[], tokensizeWhitespace?: boolean): Token[] {
  const result = tokenizeSafe(source, plugins, tokensizeWhitespace);

  if (result.at(-1)?.type === "ExpressionError") throw result.at(-1)!.error!;

  return result;
}

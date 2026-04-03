import type { Plugin } from "../plugin.js";
import type { ParserContext } from "../parser/parser-context.js";
import { current, advance } from "../parser/parser-context.js";

export const booleansPlugin: Plugin = {
  name: "booleans",
  parsePrefix: (ctx: ParserContext) => {
    const tok = current(ctx);
    if (tok.type === "Boolean") {
      advance(ctx);
      return {
        type: "BooleanLiteral",
        value: tok.value === "true",
        start: tok.start,
        end: tok.end,
      };
    }
    if (tok.type === "Null") {
      advance(ctx);
      return { type: "NullLiteral", value: null, start: tok.start, end: tok.end };
    }
    if (tok.type === "Undefined") {
      advance(ctx);
      return { type: "UndefinedLiteral", value: undefined, start: tok.start, end: tok.end };
    }
    return null;
  },
  evaluate: (node) => {
    if (node.type === "BooleanLiteral") return { value: (node as any).value };
    if (node.type === "NullLiteral") return { value: null };
    if (node.type === "UndefinedLiteral") return { value: undefined };
    return null;
  },
};

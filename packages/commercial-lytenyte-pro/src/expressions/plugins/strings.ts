import type { Plugin } from "../plugin.js";
import type { ParserContext } from "../parser/parser-context.js";
import { current, advance } from "../parser/parser-context.js";
import { parseTemplateLiteral } from "../parser/parse-template-literal.js";

export const stringsPlugin: Plugin = {
  name: "strings",
  parsePrefix: (ctx: ParserContext) => {
    const tok = current(ctx);
    if (tok.type === "String") {
      advance(ctx);
      return { type: "StringLiteral", value: tok.value, start: tok.start, end: tok.end };
    }
    if (tok.type === "TemplateLiteral") {
      return parseTemplateLiteral(ctx);
    }
    return null;
  },
  optimize: (node, opt) => {
    if (node.type === "TemplateLiteral") {
      return {
        ...node,
        parts: (node as any).parts.map((p: any) => (p.type === "StringLiteral" ? p : opt(p))),
      };
    }
    return null;
  },
  evaluate: (node, context, evalFn) => {
    if (node.type === "StringLiteral") {
      return { value: (node as any).value };
    }
    if (node.type === "TemplateLiteral") {
      const parts = (node as any).parts;
      let result = "";
      for (const part of parts) {
        if (part.type === "StringLiteral") {
          result += part.value;
        } else {
          result += String(evalFn(part, context));
        }
      }
      return { value: result };
    }
    return null;
  },
};

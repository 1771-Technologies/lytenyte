import type { Plugin } from "../plugin.js";
import type { ParserContext } from "../parser/parser-context.js";
import { current, advance } from "../parser/parser-context.js";
import { parseArrayLiteral } from "../parser/parse-array-literal.js";
import { parseObjectLiteral } from "../parser/parse-object-literal.js";
import { parseExpression } from "../parser/parse-expression.js";

export const collectionsPlugin: Plugin = {
  name: "collections",
  parsePrefix: (ctx: ParserContext) => {
    const tok = current(ctx);

    // Array literal: [elements]
    if (tok.type === "Punctuation" && tok.value === "[") {
      return parseArrayLiteral(ctx);
    }

    // Object literal: { props }
    if (tok.type === "Punctuation" && tok.value === "{") {
      return parseObjectLiteral(ctx);
    }

    // Spread element: ...expr
    if (tok.type === "Spread") {
      advance(ctx);
      const argument = parseExpression(ctx, 0);
      return { type: "SpreadElement", argument, start: tok.start, end: argument.end } as any;
    }

    return null;
  },
  optimize: (node, opt) => {
    if (node.type === "ArrayLiteral") {
      return { ...node, elements: (node as any).elements.map((e: any) => opt(e)) };
    }
    if (node.type === "ObjectLiteral") {
      return {
        ...node,
        properties: (node as any).properties.map((p: any) => ({
          ...p,
          key: p.computed ? opt(p.key) : p.key,
          value: opt(p.value),
        })),
      };
    }
    return null;
  },
  evaluate: (node, context, evalFn) => {
    if (node.type === "ArrayLiteral") {
      const result: unknown[] = [];
      for (const element of (node as any).elements) {
        if (element.type === "SpreadElement") {
          const spread = evalFn(element.argument, context) as unknown[];
          result.push(...spread);
        } else {
          result.push(evalFn(element, context));
        }
      }
      return { value: result };
    }
    if (node.type === "ObjectLiteral") {
      const result: Record<string, unknown> = {};
      for (const prop of (node as any).properties) {
        const key = prop.computed
          ? (evalFn(prop.key, context) as string)
          : prop.key.type === "Identifier"
            ? prop.key.name
            : prop.key.value;
        const value = evalFn(prop.value, context);
        result[key] = value;
      }
      return { value: result };
    }
    return null;
  },
};

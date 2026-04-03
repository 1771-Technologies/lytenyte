import type { Plugin } from "../plugin.js";
import type { ASTNode } from "../parser/types.js";
import type { ParserContext } from "../parser/parser-context.js";
import { current, advance, expect } from "../parser/parser-context.js";
import { parseExpression } from "../parser/parse-expression.js";

export const accessPlugin: Plugin = {
  name: "access",
  parsePostfix: (ctx: ParserContext, node: ASTNode) => {
    const tok = current(ctx);

    // Member access: .prop
    if (tok.type === "Punctuation" && tok.value === ".") {
      advance(ctx);
      const prop = expect(ctx, "Identifier");
      return {
        type: "MemberExpression",
        object: node,
        property: { type: "Identifier", name: prop.value, start: prop.start, end: prop.end },
        computed: false,
        start: node.start,
        end: prop.end,
      } as any;
    }

    // Computed member access: [expr]
    if (tok.type === "Punctuation" && tok.value === "[") {
      advance(ctx);
      const property = parseExpression(ctx, 0);
      const end = expect(ctx, "Punctuation", "]").end;
      return {
        type: "MemberExpression",
        object: node,
        property,
        computed: true,
        start: node.start,
        end,
      } as any;
    }

    // Optional chaining: ?.prop or ?.[expr]
    if (tok.type === "OptionalChain") {
      advance(ctx);
      if (current(ctx).type === "Punctuation" && current(ctx).value === "[") {
        advance(ctx);
        const property = parseExpression(ctx, 0);
        const end = expect(ctx, "Punctuation", "]").end;
        return {
          type: "OptionalMemberExpression",
          object: node,
          property,
          computed: true,
          start: node.start,
          end,
        } as any;
      }
      const prop = expect(ctx, "Identifier");
      return {
        type: "OptionalMemberExpression",
        object: node,
        property: { type: "Identifier", name: prop.value, start: prop.start, end: prop.end },
        computed: false,
        start: node.start,
        end: prop.end,
      } as any;
    }

    // Function call: (args)
    if (tok.type === "Punctuation" && tok.value === "(") {
      advance(ctx);
      const args: ASTNode[] = [];
      while (!(current(ctx).type === "Punctuation" && current(ctx).value === ")")) {
        if (args.length > 0) expect(ctx, "Punctuation", ",");
        if (current(ctx).type === "Punctuation" && current(ctx).value === ")") break;
        args.push(parseExpression(ctx, 0));
      }
      const end = expect(ctx, "Punctuation", ")").end;
      return {
        type: "CallExpression",
        callee: node,
        args,
        start: node.start,
        end,
      } as any;
    }

    return null;
  },
  optimize: (node, opt) => {
    if (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") {
      const n = node as any;
      return {
        ...node,
        object: opt(n.object),
        property: n.computed ? opt(n.property) : n.property,
      };
    }
    if (node.type === "CallExpression") {
      const n = node as any;
      return { ...node, callee: opt(n.callee), args: n.args.map((a: any) => opt(a)) };
    }
    return null;
  },
  evaluate: (node, context, evalFn) => {
    if (node.type === "MemberExpression") {
      const n = node as any;
      const object = evalFn(n.object, context) as any;
      if (n.computed) {
        const property = evalFn(n.property, context);
        return { value: object[property as string | number] };
      }
      return { value: object[n.property.name] };
    }
    if (node.type === "OptionalMemberExpression") {
      const n = node as any;
      const object = evalFn(n.object, context) as any;
      if (object == null) return { value: undefined };
      if (n.computed) {
        const property = evalFn(n.property, context);
        return { value: object[property as string | number] };
      }
      return { value: object[n.property.name] };
    }
    if (node.type === "CallExpression") {
      const n = node as any;
      const args = n.args.map((a: any) => evalFn(a, context));

      // Method call — preserve this binding
      if (n.callee.type === "MemberExpression" || n.callee.type === "OptionalMemberExpression") {
        const obj = evalFn(n.callee.object, context) as any;
        if (n.callee.type === "OptionalMemberExpression" && obj == null) {
          return { value: undefined };
        }
        const prop = n.callee.computed
          ? (evalFn(n.callee.property, context) as string | number)
          : n.callee.property.name;
        const method = obj[prop];
        return { value: method.apply(obj, args) };
      }

      const fn = evalFn(n.callee, context) as any;
      return { value: fn(...args) };
    }
    return null;
  },
};

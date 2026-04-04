import type { ASTNode } from "../parser/types.js";
import type { Token } from "../lexer/types.js";
import { parse } from "../parser/parse.js";
import { compile } from "../compiler/compile.js";
import { tokenize, tokenizeSafe } from "../lexer/tokenize/tokenize.js";
import { evaluateBinary } from "./evaluate-binary.js";
import { evaluateUnary } from "./evaluate-unary.js";
import type { Plugin } from "../plugin.js";

const MAX_DEPTH = 1000;

export interface RunOptions {
  undefinedIdentifierFallback?: unknown;
}

export class Evaluator {
  private plugins?: Plugin[];

  constructor(plugins?: Plugin[]) {
    this.plugins = plugins;
  }

  run = (input: string | ASTNode, context: Record<string, unknown> = {}, options?: RunOptions): unknown => {
    const node: ASTNode =
      typeof input === "string" ? compile(parse(input, 0, this.plugins), this.plugins) : input;

    return evaluateNode(node, context, 0, this.plugins, options);
  };

  ast = (input: string): ASTNode => {
    return compile(parse(input, 0, this.plugins), this.plugins);
  };

  tokens = (input: string, tokensizeWhitespace?: boolean): Token[] => {
    return tokenize(input, this.plugins, tokensizeWhitespace);
  };

  tokensSafe = (input: string, tokensizeWhitespace?: boolean): Token[] => {
    return tokenizeSafe(input, this.plugins, tokensizeWhitespace);
  };
}

export function evaluateNode(
  node: ASTNode,
  context: Record<string, unknown>,
  depth: number,
  plugins?: Plugin[],
  options?: RunOptions,
): unknown {
  if (depth > MAX_DEPTH) {
    throw new Error("Maximum evaluation depth exceeded");
  }

  // Try plugin evaluation first
  if (plugins) {
    const evalFn = (n: ASTNode, ctx: Record<string, unknown>) => evaluateNode(n, ctx, depth + 1, plugins, options);
    for (const plugin of plugins) {
      if (plugin.evaluate) {
        const result = plugin.evaluate(node, context, evalFn);
        if (result !== null) return result.value;
      }
    }
  }

  // Core built-in evaluation
  switch (node.type) {
    case "NumberLiteral":
      return node.value;
    case "Identifier": {
      if (!(node.name in context)) {
        if (options && "undefinedIdentifierFallback" in options) return options.undefinedIdentifierFallback;
        throw new Error(`Identifier "${node.name}" is not defined`);
      }
      return context[node.name];
    }
    case "BinaryExpression":
      return evaluateBinary(node, context, depth, plugins, options);
    case "UnaryExpression":
      return evaluateUnary(node.operator, evaluateNode(node.operand, context, depth + 1, plugins, options));
    case "SpreadElement":
      throw new Error("Unexpected spread element outside of array literal");
    default:
      throw new Error(`Unknown node type: ${(node as any).type}`);
  }
}

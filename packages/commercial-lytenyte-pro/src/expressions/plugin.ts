import type { ASTNode } from "./parser/types.js";
import type { ParserContext } from "./parser/parser-context.js";

export type EvalFn = (node: ASTNode, context: Record<string, unknown>) => unknown;

export interface Plugin {
  name: string;
  scan?: (source: string, pos: number) => { type: string; value: string; end: number } | null;
  parsePrefix?: (ctx: ParserContext) => ASTNode | null;
  parseInfix?: (ctx: ParserContext, left: ASTNode, minPrec: number) => ASTNode | null;
  parsePostfix?: (ctx: ParserContext, node: ASTNode) => ASTNode | null;
  parseUnary?: (ctx: ParserContext, parseNext: (ctx: ParserContext) => ASTNode) => ASTNode | null;
  infixPrecedence?: (ctx: ParserContext) => number | undefined;
  optimize?: (node: ASTNode, optimize: (n: ASTNode) => ASTNode) => ASTNode | null;
  evaluate?: (node: ASTNode, context: Record<string, unknown>, evaluate: EvalFn) => { value: unknown } | null;
}

import type { Token } from "../../expressions/lexer/types.js";

const tokenToSyntaxColor: Record<string, string> = {
  Number: "number",
  String: "string",
  TemplateLiteral: "string",
  Spread: "operator",
  Punctuation: "operator",
  Pipe: "operator",
  Operator: "operator",
  Arrow: "operator",
  Identifier: "identifier",
  ExpressionError: "error",
  Unparsed: "punctuation",
};

export function DefaultTokenHighlighter({ token }: { token: Token }) {
  const expr = tokenToSyntaxColor[token.type];
  return <span style={{ color: `var(--ln-expr-${expr})` }}>{token.value}</span>;
}

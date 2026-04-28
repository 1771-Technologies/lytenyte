import type { Token } from "../../expressions/lexer/types.js";

const tokenToSyntaxColor: Record<string, string> = {
  Number: "number",
  String: "string",
  TemplateLiteral: "string",
  DateLiteral: "date",
  Spread: "operator",
  Punctuation: "operator",
  Pipe: "operator",
  Operator: "operator",
  Arrow: "operator",
  Identifier: "identifier",
  QuotedIdentifier: "identifier",
  ExpressionError: "error",
  Unparsed: "punctuation",
};

export function DefaultTokenHighlighter({ token }: { token: Token }) {
  const expr = tokenToSyntaxColor[token.type];
  return <span style={{ color: `var(--ln-expr-${expr})` }}>{token.value}</span>;
}

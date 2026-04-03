export type BinaryOperator =
  | "||"
  | "&&"
  | "=="
  | "!="
  | "<"
  | ">"
  | "<="
  | ">="
  | "+"
  | "-"
  | "*"
  | "/"
  | "%"
  | "**"
  | "in"
  | "not";

export type UnaryOperator = "!" | "-" | "+";
export type BinaryExpressionOperator = Exclude<BinaryOperator, "not"> | "not in" | "??";

export type OperatorValue = BinaryOperator | UnaryOperator;

export type PunctuationValue = "(" | ")" | "[" | "]" | "{" | "}" | "," | "." | ":" | "?";

export interface Token {
  readonly type: string;
  readonly start: number;
  readonly end: number;
  readonly value: string;
  readonly error?: unknown;
}

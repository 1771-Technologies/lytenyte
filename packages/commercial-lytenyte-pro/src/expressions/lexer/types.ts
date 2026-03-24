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

export interface BaseToken {
  start: number;
  end: number;
}

export type Token =
  | ({ type: "Number"; value: string } & BaseToken)
  | ({ type: "String"; value: string } & BaseToken)
  | ({ type: "TemplateLiteral"; value: string } & BaseToken)
  | ({ type: "Boolean"; value: "true" | "false" } & BaseToken)
  | ({ type: "Null"; value: "null" } & BaseToken)
  | ({ type: "Undefined"; value: "undefined" } & BaseToken)
  | ({ type: "Identifier"; value: string } & BaseToken)
  | ({ type: "Operator"; value: OperatorValue } & BaseToken)
  | ({ type: "Punctuation"; value: PunctuationValue } & BaseToken)
  | ({ type: "Pipe"; value: "|>" } & BaseToken)
  | ({ type: "OptionalChain"; value: "?." } & BaseToken)
  | ({ type: "NullishCoalescing"; value: "??" } & BaseToken)
  | ({ type: "Spread"; value: "..." } & BaseToken)
  | ({ type: "Arrow"; value: "=>" } & BaseToken)
  | ({ type: "EOF"; value: "" } & BaseToken);

export type TokenType = Token["type"];

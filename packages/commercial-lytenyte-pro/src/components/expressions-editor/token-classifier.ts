import type { ExpressionEditorRoot } from "./root";

export const defaultTokenClassifier = (token: Omit<ExpressionEditorRoot.Token, "class">): string => {
  switch (token.type) {
    case "Number":
      return "expr-number";
    case "String":
      return "expr-string";
    case "TemplateLiteral":
      return "expr-template";
    case "Boolean":
    case "Null":
    case "Undefined":
      return "expr-keyword";
    case "Identifier":
      return "expr-identifier";
    case "Operator":
    case "Pipe":
    case "OptionalChain":
    case "NullishCoalescing":
    case "Spread":
    case "Arrow":
      return "expr-operator";
    case "Punctuation":
      return "expr-punctuation";
    case "TokenError":
      return "expr-error";
    default:
      return "expr-token";
  }
};

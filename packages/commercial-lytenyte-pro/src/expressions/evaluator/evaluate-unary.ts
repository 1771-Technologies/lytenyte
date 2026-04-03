import type { UnaryOperator } from "../lexer/types.js";

export function evaluateUnary(operator: UnaryOperator, operand: unknown): unknown {
  switch (operator) {
    case "-":
      return -(operand as number);
    case "+":
      return +(operand as number);
    default:
      throw new Error(`Unknown unary operator: ${operator}`);
  }
}

import type { BinaryExpressionOperator } from "../lexer/types.js";

export function evalConstant(
  op: BinaryExpressionOperator,
  left: unknown,
  right: unknown,
): unknown | undefined {
  if (typeof left === "number" && typeof right === "number") {
    switch (op) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "%":
        return left % right;
      case "**":
        return left ** right;
    }
  }
  return undefined;
}

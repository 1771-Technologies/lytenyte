import { describe, test, expect } from "vitest";
import { parse as rawParse } from "./parse.js";
import { standardPlugins } from "../plugins/standard.js";

const parse = (source: string) => rawParse(source, 0, standardPlugins);

describe("parseUnary", () => {
  test("Should parse logical not", () => {
    expect(parse("!true")).toMatchObject({
      type: "UnaryExpression",
      operator: "!",
      operand: { type: "BooleanLiteral", value: true },
    });
  });

  test("Should parse unary minus", () => {
    expect(parse("-5")).toMatchObject({
      type: "UnaryExpression",
      operator: "-",
      operand: { type: "NumberLiteral", value: 5 },
    });
  });

  test("Should parse unary plus", () => {
    expect(parse("+x")).toMatchObject({
      type: "UnaryExpression",
      operator: "+",
      operand: { type: "Identifier", name: "x" },
    });
  });

  test("Should parse nested unary operators", () => {
    expect(parse("!!true")).toMatchObject({
      type: "UnaryExpression",
      operator: "!",
      operand: {
        type: "UnaryExpression",
        operator: "!",
        operand: { type: "BooleanLiteral", value: true },
      },
    });
  });

  test("Should parse double negation", () => {
    expect(parse("--x")).toMatchObject({
      type: "UnaryExpression",
      operator: "-",
      operand: {
        type: "UnaryExpression",
        operator: "-",
      },
    });
  });

  test("Should delegate to postfix when no unary operator", () => {
    expect(parse("42")).toMatchObject({ type: "NumberLiteral", value: 42 });
  });
});

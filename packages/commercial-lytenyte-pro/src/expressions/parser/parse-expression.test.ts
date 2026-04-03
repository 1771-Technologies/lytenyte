import { describe, test, expect } from "vitest";
import { parse as rawParse } from "./parse.js";
import { parseExpression } from "./parse-expression.js";
import { tokenize } from "../lexer/tokenize/tokenize.js";
import type { ParserContext } from "./parser-context.js";
import { standardPlugins } from "../plugins/standard.js";

const parse = (source: string, depth = 0, plugins = standardPlugins) => rawParse(source, depth, plugins);

describe("parseExpression", () => {
  test("Should parse addition", () => {
    expect(parse("1 + 2")).toMatchObject({
      type: "BinaryExpression",
      operator: "+",
      left: { type: "NumberLiteral", value: 1 },
      right: { type: "NumberLiteral", value: 2 },
    });
  });

  test("Should respect multiplication over addition precedence", () => {
    expect(parse("1 + 2 * 3")).toMatchObject({
      type: "BinaryExpression",
      operator: "+",
      right: {
        type: "BinaryExpression",
        operator: "*",
      },
    });
  });

  test("Should parse left-associative operators", () => {
    expect(parse("1 - 2 - 3")).toMatchObject({
      type: "BinaryExpression",
      operator: "-",
      left: {
        type: "BinaryExpression",
        operator: "-",
        left: { type: "NumberLiteral", value: 1 },
        right: { type: "NumberLiteral", value: 2 },
      },
      right: { type: "NumberLiteral", value: 3 },
    });
  });

  test("Should parse right-associative ** operator", () => {
    expect(parse("2 ** 3 ** 4")).toMatchObject({
      type: "BinaryExpression",
      operator: "**",
      left: { type: "NumberLiteral", value: 2 },
      right: {
        type: "BinaryExpression",
        operator: "**",
        left: { type: "NumberLiteral", value: 3 },
        right: { type: "NumberLiteral", value: 4 },
      },
    });
  });

  test("Should parse ternary before binary", () => {
    expect(parse("a ? b : c")).toMatchObject({
      type: "ConditionalExpression",
      test: { type: "Identifier", name: "a" },
      consequent: { type: "Identifier", name: "b" },
      alternate: { type: "Identifier", name: "c" },
    });
  });

  test("Should parse ternary after binary expression", () => {
    expect(parse("a > 5 ? b : c")).toMatchObject({
      type: "ConditionalExpression",
      test: {
        type: "BinaryExpression",
        operator: ">",
      },
    });
  });

  test("Should parse pipe expression", () => {
    expect(parse("x |> upper")).toMatchObject({
      type: "PipeExpression",
      input: { type: "Identifier", name: "x" },
      transform: { type: "Identifier", name: "upper" },
    });
  });

  test("Should parse chained pipes", () => {
    expect(parse("x |> a |> b")).toMatchObject({
      type: "PipeExpression",
      input: { type: "PipeExpression" },
      transform: { type: "Identifier", name: "b" },
    });
  });

  test("Should parse pipe after binary expression", () => {
    expect(parse("1 + 2 |> toString")).toMatchObject({
      type: "PipeExpression",
      input: { type: "BinaryExpression", operator: "+" },
      transform: { type: "Identifier", name: "toString" },
    });
  });

  test("Should parse pipe inside ternary alternate", () => {
    expect(parse("a ? b : c |> upper")).toMatchObject({
      type: "ConditionalExpression",
      alternate: {
        type: "PipeExpression",
        input: { type: "Identifier", name: "c" },
        transform: { type: "Identifier", name: "upper" },
      },
    });
  });

  test("Should parse not in operator", () => {
    expect(parse('"x" not in arr')).toMatchObject({
      type: "BinaryExpression",
      operator: "not in",
    });
  });

  test("Should parse in operator", () => {
    expect(parse('"x" in arr')).toMatchObject({
      type: "BinaryExpression",
      operator: "in",
    });
  });

  test("Should parse nullish coalescing", () => {
    expect(parse("a ?? b")).toMatchObject({
      type: "BinaryExpression",
      operator: "??",
    });
  });

  test("Should parse logical AND", () => {
    expect(parse("a && b")).toMatchObject({
      type: "BinaryExpression",
      operator: "&&",
    });
  });

  test("Should parse logical OR", () => {
    expect(parse("a || b")).toMatchObject({
      type: "BinaryExpression",
      operator: "||",
    });
  });

  test("Should parse comparison operators", () => {
    expect(parse("a >= 5")).toMatchObject({
      type: "BinaryExpression",
      operator: ">=",
    });
  });

  test("Should treat not without in as end of expression", () => {
    const source = "a not";
    const tokens = tokenize(source);
    const ctx: ParserContext = { tokens, pos: 0, source, depth: 0 };
    const result = parseExpression(ctx, 0);
    expect(result).toMatchObject({ type: "Identifier", name: "a" });
    expect(ctx.tokens[ctx.pos].value).toBe("not");
  });

  test("Should skip plugin without parseInfix hook", () => {
    const plugin = { name: "no-infix" };
    expect(parse("1 + 2", 0, [plugin])).toMatchObject({
      type: "BinaryExpression",
      operator: "+",
    });
  });

  test("Should skip plugin parseInfix that returns null", () => {
    const plugin = { name: "null-infix", parseInfix: () => null };
    expect(parse("1 + 2", 0, [plugin])).toMatchObject({
      type: "BinaryExpression",
      operator: "+",
    });
  });

  test("Should parse arithmetic without plugins", () => {
    // Tests the branch where ctx.plugins is undefined/falsy
    expect(rawParse("1 + 2 * 3")).toMatchObject({
      type: "BinaryExpression",
      operator: "+",
      left: { type: "NumberLiteral", value: 1 },
      right: {
        type: "BinaryExpression",
        operator: "*",
        left: { type: "NumberLiteral", value: 2 },
        right: { type: "NumberLiteral", value: 3 },
      },
    });
  });
});

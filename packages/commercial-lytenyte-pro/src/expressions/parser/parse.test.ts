import { describe, test, expect } from "vitest";
import { parse as rawParse } from "./parse.js";
import { standardPlugins } from "../plugins/standard.js";

const parse = (source: string, depth = 0) => rawParse(source, depth, standardPlugins);

describe("parse", () => {
  test("Should parse a number literal", () => {
    const ast = parse("42");
    expect(ast).toMatchObject({ type: "NumberLiteral", value: 42 });
  });

  test("Should parse a string literal", () => {
    const ast = parse('"hello"');
    expect(ast).toMatchObject({ type: "StringLiteral", value: "hello" });
  });

  test("Should parse a boolean literal", () => {
    expect(parse("true")).toMatchObject({ type: "BooleanLiteral", value: true });
    expect(parse("false")).toMatchObject({ type: "BooleanLiteral", value: false });
  });

  test("Should parse null literal", () => {
    expect(parse("null")).toMatchObject({ type: "NullLiteral", value: null });
  });

  test("Should parse undefined literal", () => {
    expect(parse("undefined")).toMatchObject({ type: "UndefinedLiteral", value: undefined });
  });

  test("Should parse an identifier", () => {
    expect(parse("foo")).toMatchObject({ type: "Identifier", name: "foo" });
  });

  test("Should parse a binary expression", () => {
    const ast = parse("1 + 2");
    expect(ast).toMatchObject({
      type: "BinaryExpression",
      operator: "+",
      left: { type: "NumberLiteral", value: 1 },
      right: { type: "NumberLiteral", value: 2 },
    });
  });

  test("Should parse a unary expression", () => {
    const ast = parse("!true");
    expect(ast).toMatchObject({
      type: "UnaryExpression",
      operator: "!",
      operand: { type: "BooleanLiteral", value: true },
    });
  });

  test("Should parse a ternary expression", () => {
    const ast = parse("a ? b : c");
    expect(ast).toMatchObject({
      type: "ConditionalExpression",
      test: { type: "Identifier", name: "a" },
      consequent: { type: "Identifier", name: "b" },
      alternate: { type: "Identifier", name: "c" },
    });
  });

  test("Should parse member access", () => {
    const ast = parse("a.b");
    expect(ast).toMatchObject({
      type: "MemberExpression",
      object: { type: "Identifier", name: "a" },
      property: { type: "Identifier", name: "b" },
      computed: false,
    });
  });

  test("Should parse computed member access", () => {
    const ast = parse('a["b"]');
    expect(ast).toMatchObject({
      type: "MemberExpression",
      object: { type: "Identifier", name: "a" },
      computed: true,
    });
  });

  test("Should parse optional chaining", () => {
    const ast = parse("a?.b");
    expect(ast).toMatchObject({
      type: "OptionalMemberExpression",
      object: { type: "Identifier", name: "a" },
      computed: false,
    });
  });

  test("Should parse a call expression", () => {
    const ast = parse("fn(1, 2)");
    expect(ast).toMatchObject({
      type: "CallExpression",
      callee: { type: "Identifier", name: "fn" },
      args: [
        { type: "NumberLiteral", value: 1 },
        { type: "NumberLiteral", value: 2 },
      ],
    });
  });

  test("Should parse a pipe expression", () => {
    const ast = parse("x |> upper");
    expect(ast).toMatchObject({
      type: "PipeExpression",
      input: { type: "Identifier", name: "x" },
      transform: { type: "Identifier", name: "upper" },
    });
  });

  test("Should parse an array literal", () => {
    const ast = parse("[1, 2, 3]");
    expect(ast).toMatchObject({
      type: "ArrayLiteral",
      elements: [
        { type: "NumberLiteral", value: 1 },
        { type: "NumberLiteral", value: 2 },
        { type: "NumberLiteral", value: 3 },
      ],
    });
  });

  test("Should parse an object literal", () => {
    const ast = parse('{ a: 1, "b": 2 }');
    expect(ast).toMatchObject({
      type: "ObjectLiteral",
      properties: [
        { key: { type: "Identifier", name: "a" }, value: { type: "NumberLiteral", value: 1 } },
        { key: { type: "StringLiteral", value: "b" }, value: { type: "NumberLiteral", value: 2 } },
      ],
    });
  });

  test("Should parse a template literal", () => {
    const ast = parse("`hello ${name}`");
    expect(ast).toMatchObject({
      type: "TemplateLiteral",
      parts: [
        { type: "StringLiteral", value: "hello " },
        { type: "Identifier", name: "name" },
      ],
    });
  });

  test("Should parse a single-param arrow function", () => {
    const ast = parse("x => x + 1");
    expect(ast).toMatchObject({
      type: "ArrowFunctionExpression",
      params: ["x"],
      body: { type: "BinaryExpression", operator: "+" },
    });
  });

  test("Should parse a multi-param arrow function", () => {
    const ast = parse("(x,y) => x + y");
    expect(ast).toMatchObject({
      type: "ArrowFunctionExpression",
      params: ["x", "y"],
      body: { type: "BinaryExpression", operator: "+" },
    });
  });

  test("Should parse a map expression of the arrow function", () => {
    const ast = parse("map((x,i) => x + i)");
    expect(ast).toMatchObject({
      type: "CallExpression",
      callee: { type: "Identifier", name: "map" },
      args: [
        {
          type: "ArrowFunctionExpression",
          params: ["x", "i"],
          body: { type: "BinaryExpression", operator: "+" },
        },
      ],
    });
  });

  test("Should parse a spread element inside an array", () => {
    const ast = parse("[...arr]");
    expect(ast).toMatchObject({
      type: "ArrayLiteral",
      elements: [{ type: "SpreadElement", argument: { type: "Identifier", name: "arr" } }],
    });
  });

  test("Should throw on unexpected token after expression", () => {
    expect(() => parse("1 2")).toThrow('Unexpected token "2"');
  });

  test("Should throw on empty expression", () => {
    expect(() => parse("")).toThrow("Unexpected end of expression");
  });

  test("Should throw on max nesting depth exceeded", () => {
    expect(() => parse("a", 33)).toThrow("Maximum template nesting depth exceeded");
  });

  test("Should respect operator precedence", () => {
    const ast = parse("1 + 2 * 3");
    expect(ast).toMatchObject({
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

  test("Should parse parenthesized expressions", () => {
    const ast = parse("(1 + 2) * 3");
    expect(ast).toMatchObject({
      type: "BinaryExpression",
      operator: "*",
      left: {
        type: "BinaryExpression",
        operator: "+",
      },
      right: { type: "NumberLiteral", value: 3 },
    });
  });

  test("Should parse not in operator", () => {
    const ast = parse('"x" not in arr');
    expect(ast).toMatchObject({
      type: "BinaryExpression",
      operator: "not in",
    });
  });

  test("Should parse nullish coalescing", () => {
    const ast = parse("a ?? b");
    expect(ast).toMatchObject({
      type: "BinaryExpression",
      operator: "??",
    });
  });

  test("Should parse chained pipes", () => {
    const ast = parse("x |> a |> b");
    expect(ast).toMatchObject({
      type: "PipeExpression",
      input: {
        type: "PipeExpression",
        input: { type: "Identifier", name: "x" },
        transform: { type: "Identifier", name: "a" },
      },
      transform: { type: "Identifier", name: "b" },
    });
  });

  test("Should parse pipe with arguments", () => {
    const ast = parse('x |> default("N/A")');
    expect(ast).toMatchObject({
      type: "PipeExpression",
      transform: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "default" },
      },
    });
  });
});

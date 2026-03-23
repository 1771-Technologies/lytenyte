import { describe, test, expect } from "vitest";
import { parse as rawParse } from "./parse.js";
import { standardPlugins } from "../plugins/standard.js";

const parse = (source: string) => rawParse(source, 0, standardPlugins);

describe("parseArrowFunction", () => {
  test("Should parse a single-param arrow function without parens", () => {
    expect(parse("x => x + 1")).toMatchObject({
      type: "ArrowFunctionExpression",
      params: ["x"],
      body: {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "Identifier", name: "x" },
        right: { type: "NumberLiteral", value: 1 },
      },
    });
  });

  test("Should parse a single-param arrow function with parens", () => {
    expect(parse("(x) => x * 2")).toMatchObject({
      type: "ArrowFunctionExpression",
      params: ["x"],
      body: {
        type: "BinaryExpression",
        operator: "*",
        left: { type: "Identifier", name: "x" },
        right: { type: "NumberLiteral", value: 2 },
      },
    });
  });

  test("Should parse a multi-param arrow function with parens", () => {
    expect(parse("(a, b) => a + b")).toMatchObject({
      type: "ArrowFunctionExpression",
      params: ["a", "b"],
      body: {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "Identifier", name: "a" },
        right: { type: "Identifier", name: "b" },
      },
    });
  });

  test("Should parse a zero-param arrow function", () => {
    expect(parse("() => 42")).toMatchObject({
      type: "ArrowFunctionExpression",
      params: [],
      body: { type: "NumberLiteral", value: 42 },
    });
  });

  test("Should parse arrow function with ternary body", () => {
    expect(parse('x => x >= 18 ? "adult" : "minor"')).toMatchObject({
      type: "ArrowFunctionExpression",
      params: ["x"],
      body: {
        type: "ConditionalExpression",
        test: { type: "BinaryExpression", operator: ">=" },
      },
    });
  });

  test("Should parse arrow function with member access in body", () => {
    expect(parse("x => x.name")).toMatchObject({
      type: "ArrowFunctionExpression",
      params: ["x"],
      body: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "x" },
        property: { type: "Identifier", name: "name" },
      },
    });
  });

  test("Should parse arrow function as pipe transform argument", () => {
    expect(parse("items |> filter(x => x > 0)")).toMatchObject({
      type: "PipeExpression",
      transform: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "filter" },
        args: [
          {
            type: "ArrowFunctionExpression",
            params: ["x"],
            body: {
              type: "BinaryExpression",
              operator: ">",
            },
          },
        ],
      },
    });
  });

  test("Should parse multi-param arrow in call with parens", () => {
    expect(parse("sort((a, b) => a - b)")).toMatchObject({
      type: "CallExpression",
      callee: { type: "Identifier", name: "sort" },
      args: [
        {
          type: "ArrowFunctionExpression",
          params: ["a", "b"],
          body: {
            type: "BinaryExpression",
            operator: "-",
          },
        },
      ],
    });
  });

  test("Should parse arrow function with constant body", () => {
    expect(parse("() => 3")).toMatchObject({
      type: "ArrowFunctionExpression",
      params: [],
      body: { type: "NumberLiteral", value: 3 },
    });
  });

  test("Should parse arrow function with pipe in body", () => {
    expect(parse("x => x |> upper")).toMatchObject({
      type: "ArrowFunctionExpression",
      params: ["x"],
      body: {
        type: "PipeExpression",
        input: { type: "Identifier", name: "x" },
        transform: { type: "Identifier", name: "upper" },
      },
    });
  });

  test("Should parse parenthesized expression when not followed by arrow", () => {
    expect(parse("(1 + 2)")).toMatchObject({
      type: "BinaryExpression",
      operator: "+",
    });
  });

  test("Should parse identifier when not followed by arrow", () => {
    expect(parse("x")).toMatchObject({
      type: "Identifier",
      name: "x",
    });
  });

  test("Should parse three-param arrow function", () => {
    expect(parse("(a, b, c) => a + b + c")).toMatchObject({
      type: "ArrowFunctionExpression",
      params: ["a", "b", "c"],
    });
  });

  test("Should parse nested parens as regular expression not arrow", () => {
    expect(parse("((1 + 2))")).toMatchObject({
      type: "BinaryExpression",
      operator: "+",
    });
  });
});

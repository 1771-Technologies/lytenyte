import { describe, test, expect } from "vitest";
import { parse as rawParse } from "./parse.js";
import { standardPlugins } from "../plugins/standard.js";

const parse = (source: string) => rawParse(source, 0, standardPlugins);

describe("parseArrayLiteral", () => {
  test("Should parse an empty array", () => {
    expect(parse("[]")).toMatchObject({ type: "ArrayLiteral", elements: [] });
  });

  test("Should parse an array with one element", () => {
    expect(parse("[1]")).toMatchObject({
      type: "ArrayLiteral",
      elements: [{ type: "NumberLiteral", value: 1 }],
    });
  });

  test("Should parse an array with multiple elements", () => {
    expect(parse("[1, 2, 3]")).toMatchObject({
      type: "ArrayLiteral",
      elements: [
        { type: "NumberLiteral", value: 1 },
        { type: "NumberLiteral", value: 2 },
        { type: "NumberLiteral", value: 3 },
      ],
    });
  });

  test("Should parse an array with trailing comma", () => {
    expect(parse("[1, 2,]")).toMatchObject({
      type: "ArrayLiteral",
      elements: [
        { type: "NumberLiteral", value: 1 },
        { type: "NumberLiteral", value: 2 },
      ],
    });
  });

  test("Should parse an array with mixed types", () => {
    expect(parse('[1, "two", true]')).toMatchObject({
      type: "ArrayLiteral",
      elements: [
        { type: "NumberLiteral", value: 1 },
        { type: "StringLiteral", value: "two" },
        { type: "BooleanLiteral", value: true },
      ],
    });
  });

  test("Should parse nested arrays", () => {
    expect(parse("[[1], [2]]")).toMatchObject({
      type: "ArrayLiteral",
      elements: [
        { type: "ArrayLiteral", elements: [{ type: "NumberLiteral", value: 1 }] },
        { type: "ArrayLiteral", elements: [{ type: "NumberLiteral", value: 2 }] },
      ],
    });
  });

  test("Should parse array with spread element", () => {
    expect(parse("[...arr]")).toMatchObject({
      type: "ArrayLiteral",
      elements: [{ type: "SpreadElement", argument: { type: "Identifier", name: "arr" } }],
    });
  });

  test("Should parse array with expressions", () => {
    expect(parse("[1 + 2, a * b]")).toMatchObject({
      type: "ArrayLiteral",
      elements: [
        { type: "BinaryExpression", operator: "+" },
        { type: "BinaryExpression", operator: "*" },
      ],
    });
  });
});

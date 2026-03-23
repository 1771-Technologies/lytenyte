import { describe, test, expect } from "vitest";
import { parse as rawParse } from "./parse.js";
import { standardPlugins } from "../plugins/standard.js";

const parse = (source: string) => rawParse(source, 0, standardPlugins);

describe("parsePipeTransform", () => {
  test("Should parse a simple identifier transform", () => {
    expect(parse("x |> upper")).toMatchObject({
      type: "PipeExpression",
      transform: { type: "Identifier", name: "upper" },
    });
  });

  test("Should parse a transform with arguments", () => {
    expect(parse('x |> default("N/A")')).toMatchObject({
      type: "PipeExpression",
      transform: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "default" },
        args: [{ type: "StringLiteral", value: "N/A" }],
      },
    });
  });

  test("Should parse a transform with multiple arguments", () => {
    expect(parse("x |> slice(0, 5)")).toMatchObject({
      type: "PipeExpression",
      transform: {
        type: "CallExpression",
        args: [
          { type: "NumberLiteral", value: 0 },
          { type: "NumberLiteral", value: 5 },
        ],
      },
    });
  });

  test("Should parse a transform with no arguments as a call", () => {
    expect(parse("x |> trim()")).toMatchObject({
      type: "PipeExpression",
      transform: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "trim" },
        args: [],
      },
    });
  });

  test("Should parse a transform with trailing comma", () => {
    expect(parse("x |> slice(0,)")).toMatchObject({
      type: "PipeExpression",
      transform: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "slice" },
        args: [{ type: "NumberLiteral", value: 0 }],
      },
    });
  });
});

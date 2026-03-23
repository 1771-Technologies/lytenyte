import { describe, test, expect } from "vitest";
import { parse as rawParse } from "./parse.js";
import { standardPlugins } from "../plugins/standard.js";

const parse = (source: string) => rawParse(source, 0, standardPlugins);

describe("parseTemplateLiteral", () => {
  test("Should parse a plain template literal", () => {
    expect(parse("`hello`")).toMatchObject({
      type: "TemplateLiteral",
      parts: [{ type: "StringLiteral", value: "hello" }],
    });
  });

  test("Should parse an empty template literal", () => {
    expect(parse("``")).toMatchObject({
      type: "TemplateLiteral",
      parts: [],
    });
  });

  test("Should parse a template with single interpolation", () => {
    expect(parse("`hello ${name}`")).toMatchObject({
      type: "TemplateLiteral",
      parts: [
        { type: "StringLiteral", value: "hello " },
        { type: "Identifier", name: "name" },
      ],
    });
  });

  test("Should parse a template with multiple interpolations", () => {
    expect(parse("`${a} and ${b}`")).toMatchObject({
      type: "TemplateLiteral",
      parts: [
        { type: "Identifier", name: "a" },
        { type: "StringLiteral", value: " and " },
        { type: "Identifier", name: "b" },
      ],
    });
  });

  test("Should parse a template with expression interpolation", () => {
    expect(parse("`result: ${1 + 2}`")).toMatchObject({
      type: "TemplateLiteral",
      parts: [
        { type: "StringLiteral", value: "result: " },
        { type: "BinaryExpression", operator: "+" },
      ],
    });
  });

  test("Should parse a template with trailing text after interpolation", () => {
    expect(parse("`${x} done`")).toMatchObject({
      type: "TemplateLiteral",
      parts: [
        { type: "Identifier", name: "x" },
        { type: "StringLiteral", value: " done" },
      ],
    });
  });

  test("Should parse a template with only interpolation", () => {
    expect(parse("`${x}`")).toMatchObject({
      type: "TemplateLiteral",
      parts: [{ type: "Identifier", name: "x" }],
    });
  });

  test("Should parse a template with nested braces in interpolation", () => {
    expect(parse("`${fn({a: 1})}`")).toMatchObject({
      type: "TemplateLiteral",
      parts: [
        {
          type: "CallExpression",
          callee: { type: "Identifier", name: "fn" },
          args: [
            {
              type: "ObjectLiteral",
              properties: [
                {
                  key: { type: "Identifier", name: "a" },
                  value: { type: "NumberLiteral", value: 1 },
                },
              ],
            },
          ],
        },
      ],
    });
  });
});

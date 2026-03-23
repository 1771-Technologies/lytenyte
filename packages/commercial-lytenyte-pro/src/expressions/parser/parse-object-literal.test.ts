import { describe, test, expect } from "vitest";
import { parse as rawParse } from "./parse.js";
import { standardPlugins } from "../plugins/standard.js";

const parse = (source: string) => rawParse(source, 0, standardPlugins);

describe("parseObjectLiteral", () => {
  test("Should parse an empty object", () => {
    expect(parse("{}")).toMatchObject({ type: "ObjectLiteral", properties: [] });
  });

  test("Should parse an object with identifier keys", () => {
    expect(parse("{ a: 1 }")).toMatchObject({
      type: "ObjectLiteral",
      properties: [
        {
          key: { type: "Identifier", name: "a" },
          value: { type: "NumberLiteral", value: 1 },
          computed: false,
        },
      ],
    });
  });

  test("Should parse an object with string keys", () => {
    expect(parse('{ "key": 1 }')).toMatchObject({
      type: "ObjectLiteral",
      properties: [
        {
          key: { type: "StringLiteral", value: "key" },
          value: { type: "NumberLiteral", value: 1 },
        },
      ],
    });
  });

  test("Should parse shorthand properties", () => {
    expect(parse("{ name }")).toMatchObject({
      type: "ObjectLiteral",
      properties: [
        {
          key: { type: "Identifier", name: "name" },
          value: { type: "Identifier", name: "name" },
          computed: false,
        },
      ],
    });
  });

  test("Should parse computed properties", () => {
    expect(parse("{ [key]: 1 }")).toMatchObject({
      type: "ObjectLiteral",
      properties: [
        {
          key: { type: "Identifier", name: "key" },
          value: { type: "NumberLiteral", value: 1 },
          computed: true,
        },
      ],
    });
  });

  test("Should parse multiple properties", () => {
    expect(parse("{ a: 1, b: 2 }")).toMatchObject({
      type: "ObjectLiteral",
      properties: [{ key: { type: "Identifier", name: "a" } }, { key: { type: "Identifier", name: "b" } }],
    });
  });

  test("Should parse trailing comma", () => {
    expect(parse("{ a: 1, }")).toMatchObject({
      type: "ObjectLiteral",
      properties: [{ key: { type: "Identifier", name: "a" } }],
    });
  });

  test("Should throw on invalid property key", () => {
    expect(() => parse("{ 123: 1 }")).toThrow('Expected property name but got "123"');
  });

  test("Should parse nested objects", () => {
    expect(parse("{ a: { b: 1 } }")).toMatchObject({
      type: "ObjectLiteral",
      properties: [
        {
          value: {
            type: "ObjectLiteral",
            properties: [{ key: { type: "Identifier", name: "b" } }],
          },
        },
      ],
    });
  });

  test("Should parse mixed shorthand and regular properties", () => {
    expect(parse("{ name, age: 25 }")).toMatchObject({
      type: "ObjectLiteral",
      properties: [
        { key: { type: "Identifier", name: "name" }, value: { type: "Identifier", name: "name" } },
        { key: { type: "Identifier", name: "age" }, value: { type: "NumberLiteral", value: 25 } },
      ],
    });
  });
});

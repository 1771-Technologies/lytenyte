import { describe, test, expect } from "vitest";
import { parse as rawParse } from "./parse.js";
import { standardPlugins } from "../plugins/standard.js";

const parse = (source: string) => rawParse(source, 0, standardPlugins);

describe("parsePostfix", () => {
  test("Should parse dot notation member access", () => {
    expect(parse("a.b")).toMatchObject({
      type: "MemberExpression",
      object: { type: "Identifier", name: "a" },
      property: { type: "Identifier", name: "b" },
      computed: false,
    });
  });

  test("Should parse chained dot access", () => {
    expect(parse("a.b.c")).toMatchObject({
      type: "MemberExpression",
      object: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "a" },
        property: { type: "Identifier", name: "b" },
      },
      property: { type: "Identifier", name: "c" },
    });
  });

  test("Should parse bracket notation member access", () => {
    expect(parse('a["b"]')).toMatchObject({
      type: "MemberExpression",
      object: { type: "Identifier", name: "a" },
      computed: true,
    });
  });

  test("Should parse numeric bracket access", () => {
    expect(parse("a[0]")).toMatchObject({
      type: "MemberExpression",
      computed: true,
      property: { type: "NumberLiteral", value: 0 },
    });
  });

  test("Should parse optional chaining with property", () => {
    expect(parse("a?.b")).toMatchObject({
      type: "OptionalMemberExpression",
      object: { type: "Identifier", name: "a" },
      property: { type: "Identifier", name: "b" },
      computed: false,
    });
  });

  test("Should parse optional chaining with computed property", () => {
    expect(parse("a?.[0]")).toMatchObject({
      type: "OptionalMemberExpression",
      object: { type: "Identifier", name: "a" },
      computed: true,
    });
  });

  test("Should parse function call with no arguments", () => {
    expect(parse("fn()")).toMatchObject({
      type: "CallExpression",
      callee: { type: "Identifier", name: "fn" },
      args: [],
    });
  });

  test("Should parse function call with arguments", () => {
    expect(parse("fn(1, 2)")).toMatchObject({
      type: "CallExpression",
      callee: { type: "Identifier", name: "fn" },
      args: [
        { type: "NumberLiteral", value: 1 },
        { type: "NumberLiteral", value: 2 },
      ],
    });
  });

  test("Should parse method call", () => {
    expect(parse("a.b(1)")).toMatchObject({
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "a" },
        property: { type: "Identifier", name: "b" },
      },
      args: [{ type: "NumberLiteral", value: 1 }],
    });
  });

  test("Should parse chained calls", () => {
    expect(parse("a()()")).toMatchObject({
      type: "CallExpression",
      callee: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "a" },
      },
    });
  });

  test("Should parse mixed postfix operations", () => {
    expect(parse("a.b[0]()")).toMatchObject({
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        computed: true,
        object: {
          type: "MemberExpression",
          computed: false,
        },
      },
    });
  });

  test("Should parse function call with trailing comma", () => {
    expect(parse("fn(1,)")).toMatchObject({
      type: "CallExpression",
      callee: { type: "Identifier", name: "fn" },
      args: [{ type: "NumberLiteral", value: 1 }],
    });
  });
});

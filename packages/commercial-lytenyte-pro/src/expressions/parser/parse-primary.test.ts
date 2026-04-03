import { describe, test, expect } from "vitest";
import { parse as rawParse } from "./parse.js";
import { standardPlugins } from "../plugins/standard.js";

const parse = (source: string, depth = 0, plugins = standardPlugins) => rawParse(source, depth, plugins);

describe("parsePrimary", () => {
  test("Should parse integer numbers", () => {
    expect(parse("42")).toMatchObject({ type: "NumberLiteral", value: 42 });
  });

  test("Should parse decimal numbers", () => {
    expect(parse("3.14")).toMatchObject({ type: "NumberLiteral", value: 3.14 });
  });

  test("Should parse numbers with underscore separators", () => {
    expect(parse("1_000")).toMatchObject({ type: "NumberLiteral", value: 1000 });
  });

  test("Should parse hex numbers", () => {
    expect(parse("0xFF")).toMatchObject({ type: "NumberLiteral", value: 255 });
  });

  test("Should parse double-quoted strings", () => {
    expect(parse('"hello"')).toMatchObject({ type: "StringLiteral", value: "hello" });
  });

  test("Should parse single-quoted strings", () => {
    expect(parse("'world'")).toMatchObject({ type: "StringLiteral", value: "world" });
  });

  test("Should parse true", () => {
    expect(parse("true")).toMatchObject({ type: "BooleanLiteral", value: true });
  });

  test("Should parse false", () => {
    expect(parse("false")).toMatchObject({ type: "BooleanLiteral", value: false });
  });

  test("Should parse null", () => {
    expect(parse("null")).toMatchObject({ type: "NullLiteral", value: null });
  });

  test("Should parse undefined", () => {
    expect(parse("undefined")).toMatchObject({ type: "UndefinedLiteral", value: undefined });
  });

  test("Should parse identifiers", () => {
    expect(parse("foo")).toMatchObject({ type: "Identifier", name: "foo" });
  });

  test("Should parse parenthesized expressions", () => {
    const ast = parse("(42)");
    expect(ast).toMatchObject({ type: "NumberLiteral", value: 42 });
  });

  test("Should parse spread elements", () => {
    const ast = parse("[...arr]");
    expect(ast).toMatchObject({
      type: "ArrayLiteral",
      elements: [{ type: "SpreadElement", argument: { type: "Identifier", name: "arr" } }],
    });
  });

  test("Should throw on unexpected end of expression", () => {
    expect(() => parse("")).toThrow("Unexpected end of expression");
  });

  test("Should throw on unexpected token", () => {
    expect(() => parse(")")).toThrow('Unexpected token ")"');
  });

  test("Should skip plugin without parsePrefix hook", () => {
    const plugin = { name: "no-prefix" };
    expect(parse("42", 0, [plugin])).toMatchObject({ type: "NumberLiteral", value: 42 });
  });

  test("Should skip plugin parsePrefix that returns null", () => {
    const plugin = { name: "null-prefix", parsePrefix: () => null };
    expect(parse("42", 0, [plugin])).toMatchObject({ type: "NumberLiteral", value: 42 });
  });
});

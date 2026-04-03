import { describe, test, expect } from "vitest";
import { booleansPlugin } from "./booleans.js";
import { tokenize } from "../lexer/tokenize/tokenize.js";
import type { ParserContext } from "../parser/parser-context";

function makeCtx(source: string): ParserContext {
  return { tokens: tokenize(source), pos: 0, source, depth: 0 };
}

describe("booleansPlugin", () => {
  test("Should have name 'booleans'", () => {
    expect(booleansPlugin.name).toBe("booleans");
  });

  test("parsePrefix should parse true", () => {
    const ctx = makeCtx("true");
    const node = booleansPlugin.parsePrefix!(ctx);
    expect(node).toMatchObject({ type: "BooleanLiteral", value: true });
  });

  test("parsePrefix should parse false", () => {
    const ctx = makeCtx("false");
    const node = booleansPlugin.parsePrefix!(ctx);
    expect(node).toMatchObject({ type: "BooleanLiteral", value: false });
  });

  test("parsePrefix should parse null", () => {
    const ctx = makeCtx("null");
    const node = booleansPlugin.parsePrefix!(ctx);
    expect(node).toMatchObject({ type: "NullLiteral", value: null });
  });

  test("parsePrefix should parse undefined", () => {
    const ctx = makeCtx("undefined");
    const node = booleansPlugin.parsePrefix!(ctx);
    expect(node).toMatchObject({ type: "UndefinedLiteral", value: undefined });
  });

  test("parsePrefix should return null for non-boolean tokens", () => {
    const ctx = makeCtx("42");
    expect(booleansPlugin.parsePrefix!(ctx)).toBeNull();
  });

  test("evaluate should return null for non-boolean nodes", () => {
    const node = { type: "NumberLiteral", value: 1, start: 0, end: 1 } as any;
    expect(booleansPlugin.evaluate!(node, {}, () => {})).toBeNull();
  });

  test("evaluate should evaluate BooleanLiteral", () => {
    const node = { type: "BooleanLiteral", value: true, start: 0, end: 4 } as any;
    expect(booleansPlugin.evaluate!(node, {}, () => {})).toEqual({ value: true });
  });

  test("evaluate should evaluate NullLiteral", () => {
    const node = { type: "NullLiteral", value: null, start: 0, end: 4 } as any;
    expect(booleansPlugin.evaluate!(node, {}, () => {})).toEqual({ value: null });
  });

  test("evaluate should evaluate UndefinedLiteral", () => {
    const node = { type: "UndefinedLiteral", value: undefined, start: 0, end: 9 } as any;
    expect(booleansPlugin.evaluate!(node, {}, () => {})).toEqual({ value: undefined });
  });
});

import { describe, test, expect } from "vitest";
import { current, advance, expect as expectToken } from "./parser-context.js";
import type { ParserContext } from "./parser-context";
import type { Token } from "../lexer/types";

function makeCtx(tokens: Token[]): ParserContext {
  return { tokens, pos: 0, source: "test", depth: 0 };
}

function tok(type: Token["type"], value: string, start = 0, end = 1): Token {
  return { type, value, start, end } as Token;
}

describe("current", () => {
  test("Should return the token at the current position", () => {
    const ctx = makeCtx([tok("Number", "42"), tok("EOF", "")]);
    expect(current(ctx)).toMatchObject({ type: "Number", value: "42" });
  });

  test("Should not advance the position", () => {
    const ctx = makeCtx([tok("Number", "42"), tok("EOF", "")]);
    current(ctx);
    current(ctx);
    expect(ctx.pos).toBe(0);
  });
});

describe("advance", () => {
  test("Should return the current token and advance position", () => {
    const ctx = makeCtx([tok("Number", "42"), tok("Operator", "+"), tok("EOF", "")]);
    const result = advance(ctx);
    expect(result).toMatchObject({ type: "Number", value: "42" });
    expect(ctx.pos).toBe(1);
  });

  test("Should advance through multiple tokens", () => {
    const ctx = makeCtx([tok("Number", "1"), tok("Number", "2"), tok("EOF", "")]);
    advance(ctx);
    const second = advance(ctx);
    expect(second).toMatchObject({ type: "Number", value: "2" });
    expect(ctx.pos).toBe(2);
  });
});

describe("expect", () => {
  test("Should return the token when type matches", () => {
    const ctx = makeCtx([tok("Number", "42"), tok("EOF", "")]);
    const result = expectToken(ctx, "Number");
    expect(result).toMatchObject({ type: "Number", value: "42" });
  });

  test("Should advance the position on match", () => {
    const ctx = makeCtx([tok("Number", "42"), tok("EOF", "")]);
    expectToken(ctx, "Number");
    expect(ctx.pos).toBe(1);
  });

  test("Should return the token when type and value match", () => {
    const ctx = makeCtx([tok("Punctuation", "("), tok("EOF", "")]);
    const result = expectToken(ctx, "Punctuation", "(");
    expect(result).toMatchObject({ type: "Punctuation", value: "(" });
  });

  test("Should throw when type does not match", () => {
    const ctx = makeCtx([tok("Number", "42", 0, 2), tok("EOF", "", 2, 2)]);
    expect(() => expectToken(ctx, "Operator")).toThrow('Expected Operator but got "42"');
  });

  test("Should throw when value does not match", () => {
    const ctx = makeCtx([tok("Punctuation", ")", 0, 1), tok("EOF", "", 1, 1)]);
    expect(() => expectToken(ctx, "Punctuation", "(")).toThrow('Expected "(" but got ")"');
  });

  test("Should not advance the position on failure", () => {
    const ctx = makeCtx([tok("Number", "42"), tok("EOF", "")]);
    try {
      expectToken(ctx, "Operator");
    } catch {
      // expected
    }
    expect(ctx.pos).toBe(0);
  });

  test("Should show token type in error when value is empty", () => {
    const ctx = makeCtx([tok("EOF", "", 0, 0)]);
    expect(() => expectToken(ctx, "Punctuation", ")")).toThrow('Expected ")" but got EOF');
  });
});

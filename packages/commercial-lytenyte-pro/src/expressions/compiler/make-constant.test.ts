import { describe, test, expect } from "vitest";
import { makeConstant } from "./make-constant.js";

describe("makeConstant", () => {
  test("Should create a NumberLiteral for number values", () => {
    expect(makeConstant(42, 0, 2)).toMatchObject({
      type: "NumberLiteral",
      value: 42,
      start: 0,
      end: 2,
    });
  });

  test("Should create a StringLiteral for string values", () => {
    expect(makeConstant("hi", 0, 4)).toMatchObject({
      type: "StringLiteral",
      value: "hi",
      start: 0,
      end: 4,
    });
  });

  test("Should create a BooleanLiteral for boolean values", () => {
    expect(makeConstant(true, 0, 4)).toMatchObject({
      type: "BooleanLiteral",
      value: true,
      start: 0,
      end: 4,
    });
  });

  test("Should create a NullLiteral for null", () => {
    expect(makeConstant(null, 0, 4)).toMatchObject({
      type: "NullLiteral",
      value: null,
      start: 0,
      end: 4,
    });
  });

  test("Should create an UndefinedLiteral for undefined", () => {
    expect(makeConstant(undefined, 0, 9)).toMatchObject({
      type: "UndefinedLiteral",
      value: undefined,
      start: 0,
      end: 9,
    });
  });

  test("Should create an UndefinedLiteral for unsupported types", () => {
    expect(makeConstant({} as unknown, 0, 1)).toMatchObject({
      type: "UndefinedLiteral",
    });
  });
});

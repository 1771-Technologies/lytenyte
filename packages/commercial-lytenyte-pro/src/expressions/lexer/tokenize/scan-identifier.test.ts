import { describe, test, expect } from "vitest";
import { scanIdentifier } from "./scan-identifier";

describe("scanIdentifier", () => {
  test("Should scan a simple identifier", () => {
    expect(scanIdentifier("foo", 0)).toEqual({ type: "Identifier", value: "foo", end: 3 });
  });

  test("Should scan an identifier with underscores", () => {
    expect(scanIdentifier("bar_baz", 0)).toEqual({ type: "Identifier", value: "bar_baz", end: 7 });
  });

  test("Should scan an identifier starting with underscore", () => {
    expect(scanIdentifier("_private", 0)).toEqual({
      type: "Identifier",
      value: "_private",
      end: 8,
    });
  });

  test("Should scan an identifier starting with $", () => {
    expect(scanIdentifier("$ref", 0)).toEqual({ type: "Identifier", value: "$ref", end: 4 });
  });

  test("Should scan an identifier containing digits", () => {
    expect(scanIdentifier("item2", 0)).toEqual({ type: "Identifier", value: "item2", end: 5 });
  });

  test("Should stop at non-alphanumeric characters", () => {
    expect(scanIdentifier("abc.def", 0)).toEqual({ type: "Identifier", value: "abc", end: 3 });
  });

  test("Should stop at whitespace", () => {
    expect(scanIdentifier("hello world", 0)).toEqual({
      type: "Identifier",
      value: "hello",
      end: 5,
    });
  });

  test("Should scan from an offset position", () => {
    expect(scanIdentifier("  foo", 2)).toEqual({ type: "Identifier", value: "foo", end: 5 });
  });

  test("Should recognize true as a Boolean keyword", () => {
    expect(scanIdentifier("true", 0)).toEqual({ type: "Boolean", value: "true", end: 4 });
  });

  test("Should recognize false as a Boolean keyword", () => {
    expect(scanIdentifier("false", 0)).toEqual({ type: "Boolean", value: "false", end: 5 });
  });

  test("Should recognize null as a Null keyword", () => {
    expect(scanIdentifier("null", 0)).toEqual({ type: "Null", value: "null", end: 4 });
  });

  test("Should recognize undefined as an Undefined keyword", () => {
    expect(scanIdentifier("undefined", 0)).toEqual({
      type: "Undefined",
      value: "undefined",
      end: 9,
    });
  });

  test("Should recognize in as an Operator keyword", () => {
    expect(scanIdentifier("in", 0)).toEqual({ type: "Operator", value: "in", end: 2 });
  });

  test("Should recognize not as an Operator keyword", () => {
    expect(scanIdentifier("not", 0)).toEqual({ type: "Operator", value: "not", end: 3 });
  });

  test("Should not match keyword prefixes as keywords", () => {
    expect(scanIdentifier("trueish", 0)).toEqual({
      type: "Identifier",
      value: "trueish",
      end: 7,
    });
  });

  test("Should not match keyword prefixes for null", () => {
    expect(scanIdentifier("nullable", 0)).toEqual({
      type: "Identifier",
      value: "nullable",
      end: 8,
    });
  });
});

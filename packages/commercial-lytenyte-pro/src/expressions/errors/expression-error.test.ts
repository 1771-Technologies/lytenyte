import { describe, test, expect } from "vitest";
import { ExpressionError } from "./expression-error.js";

describe("ExpressionError", () => {
  test("Should be an instance of Error", () => {
    const err = new ExpressionError("test", { source: "abc", start: 0, end: 1 });
    expect(err).toBeInstanceOf(Error);
  });

  test("Should be an instance of ExpressionError", () => {
    const err = new ExpressionError("test", { source: "abc", start: 0, end: 1 });
    expect(err).toBeInstanceOf(ExpressionError);
  });

  test("Should set the name to ExpressionError", () => {
    const err = new ExpressionError("test", { source: "abc", start: 0, end: 1 });
    expect(err.name).toBe("ExpressionError");
  });

  test("Should store the raw message", () => {
    const err = new ExpressionError("Unexpected token", { source: "a @", start: 2, end: 3 });
    expect(err.rawMessage).toBe("Unexpected token");
  });

  test("Should store the start offset", () => {
    const err = new ExpressionError("test", { source: "abc", start: 1, end: 2 });
    expect(err.start).toBe(1);
  });

  test("Should store the end offset", () => {
    const err = new ExpressionError("test", { source: "abc", start: 1, end: 3 });
    expect(err.end).toBe(3);
  });

  test("Should store the source string", () => {
    const err = new ExpressionError("test", { source: "abc", start: 0, end: 1 });
    expect(err.source).toBe("abc");
  });

  test("Should include formatted output in the message", () => {
    const err = new ExpressionError("Unexpected token", { source: "a @", start: 2, end: 3 });
    expect(err.message).toContain("Unexpected token");
    expect(err.message).toContain("^");
    expect(err.message).toContain("a @");
  });

  test("Should store the suggestion when provided", () => {
    const err = new ExpressionError("Unknown", { source: "uper", start: 0, end: 4 }, "upper");
    expect(err.suggestion).toBe("upper");
  });

  test("Should leave suggestion undefined when not provided", () => {
    const err = new ExpressionError("test", { source: "abc", start: 0, end: 1 });
    expect(err.suggestion).toBeUndefined();
  });

  test("Should include suggestion in the formatted message", () => {
    const err = new ExpressionError("Unknown", { source: "uper", start: 0, end: 4 }, "upper");
    expect(err.message).toContain('Did you mean "upper"?');
  });
});

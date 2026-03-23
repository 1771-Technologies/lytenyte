import { describe, test, expect } from "vitest";
import {
  clampOffset,
  getLineStart,
  getLineEnd,
  offsetToPosition,
  formatError,
  ExpressionError,
} from "./index.js";

describe("errors/index barrel exports", () => {
  test("Should re-export clampOffset", () => {
    expect(typeof clampOffset).toBe("function");
  });

  test("Should re-export getLineStart", () => {
    expect(typeof getLineStart).toBe("function");
  });

  test("Should re-export getLineEnd", () => {
    expect(typeof getLineEnd).toBe("function");
  });

  test("Should re-export offsetToPosition", () => {
    expect(typeof offsetToPosition).toBe("function");
  });

  test("Should re-export formatError", () => {
    expect(typeof formatError).toBe("function");
  });

  test("Should re-export ExpressionError", () => {
    expect(typeof ExpressionError).toBe("function");
  });
});

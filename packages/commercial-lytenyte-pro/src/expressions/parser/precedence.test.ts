import { describe, test, expect } from "vitest";
import { PRECEDENCE } from "./precedence.js";

describe("PRECEDENCE", () => {
  test("Should define + and - at the same level", () => {
    expect(PRECEDENCE["+"]).toBe(PRECEDENCE["-"]);
  });

  test("Should define * / % at the same level and higher than + -", () => {
    expect(PRECEDENCE["*"]).toBe(PRECEDENCE["/"]);
    expect(PRECEDENCE["*"]).toBe(PRECEDENCE["%"]);
    expect(PRECEDENCE["*"]!).toBeGreaterThan(PRECEDENCE["+"]!);
  });

  test("Should define ** with highest binary precedence", () => {
    expect(PRECEDENCE["**"]!).toBeGreaterThan(PRECEDENCE["*"]!);
  });

  test("Should only contain arithmetic operators", () => {
    const keys = Object.keys(PRECEDENCE);
    expect(keys.sort()).toEqual(["%", "**", "*", "+", "-", "/"].sort());
  });
});

import { describe, test, expect } from "vitest";
import { toArgbColor } from "./to-argb-color.js";

describe("toArgbColor", () => {
  test("Should expand #RGB shorthand to FFRRGGBB", () => {
    expect(toArgbColor("#F00")).toBe("FFFF0000");
    expect(toArgbColor("#0F0")).toBe("FF00FF00");
    expect(toArgbColor("#00F")).toBe("FF0000FF");
    expect(toArgbColor("#ABC")).toBe("FFAABBCC");
  });

  test("Should prefix #RRGGBB with FF alpha", () => {
    expect(toArgbColor("#FF0000")).toBe("FFFF0000");
    expect(toArgbColor("#1A2B3C")).toBe("FF1A2B3C");
  });

  test("Should return AARRGGBB input as-is (uppercased)", () => {
    expect(toArgbColor("80FF0000")).toBe("80FF0000");
  });

  test("Should strip leading # from AARRGGBB input", () => {
    expect(toArgbColor("#80FF0000")).toBe("80FF0000");
  });

  test("Should uppercase the result", () => {
    expect(toArgbColor("#aabbcc")).toBe("FFAABBCC");
    expect(toArgbColor("ff1a2b3c")).toBe("FF1A2B3C");
  });

  test("Should throw for an invalid color format", () => {
    expect(() => toArgbColor("#12")).toThrow();
    expect(() => toArgbColor("#12345")).toThrow();
    expect(() => toArgbColor("not-a-color")).toThrow();
    expect(() => toArgbColor("")).toThrow();
  });
});

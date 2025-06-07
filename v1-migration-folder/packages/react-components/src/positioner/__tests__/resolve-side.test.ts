import { describe, expect, test } from "vitest";
import { resolveSide } from "../resolve-side.js";

describe("resolveSide", () => {
  test("should return the correct result", () => {
    expect(resolveSide("bottom", false)).toEqual("bottom");
    expect(resolveSide("top", false)).toEqual("top");
    expect(resolveSide("start", false)).toEqual("left");
    expect(resolveSide("start", true)).toEqual("right");
    expect(resolveSide("end", false)).toEqual("right");
    expect(resolveSide("end", true)).toEqual("left");
  });
});

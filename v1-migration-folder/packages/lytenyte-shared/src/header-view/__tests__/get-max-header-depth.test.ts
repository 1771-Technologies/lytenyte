import { describe, expect, test } from "vitest";
import { getMaxHeaderDepth } from "../get-max-header-depth.js";

describe("getMaxHeaderDepth", () => {
  test("should return the correct result", () => {
    expect(getMaxHeaderDepth([])).toEqual(0);
    expect(getMaxHeaderDepth([{ groupPath: ["a", "b"] }, { groupPath: ["a"] }, {}])).toEqual(2);
    expect(getMaxHeaderDepth([{}, {}])).toEqual(0);
  });
});

import { describe, expect, test } from "vitest";
import { isFullWidthMap } from "../is-full-width-map.js";
import { FULL_WIDTH_MAP } from "../../+constants.js";

describe("isFullWidthMap", () => {
  test("should return the correct result", () => {
    expect(isFullWidthMap(FULL_WIDTH_MAP)).toEqual(true);
    expect(isFullWidthMap(new Map())).toEqual(false);
  });
});

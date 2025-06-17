import { describe, expect, test } from "vitest";
import { FULL_WIDTH_MAP } from "../../+constants.layout";
import { isFullWidthMap } from "../is-full-width-map";

describe("isFullWidthMap", () => {
  test("should return the correct result", () => {
    expect(isFullWidthMap(FULL_WIDTH_MAP)).toEqual(true);
    expect(isFullWidthMap(new Map())).toEqual(false);
  });
});

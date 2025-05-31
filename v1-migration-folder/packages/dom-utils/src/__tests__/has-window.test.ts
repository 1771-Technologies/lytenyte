import { describe, expect, test } from "vitest";
import { hasWindow } from "../has-window";

describe("hasWindow", () => {
  test("should return the correct result", () => {
    expect(hasWindow()).toEqual(true);
  });
});

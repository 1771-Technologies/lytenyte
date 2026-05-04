import { describe, expect, test } from "vitest";
import { arrayShallow } from "./array-shallow.js";

describe("arrayShallow", () => {
  test("Should correctly compare shallow arrays", () => {
    expect(arrayShallow([1, 2], [1])).toEqual(false);
    expect(arrayShallow([1, 2], [1, 2])).toEqual(true);
    expect(arrayShallow([1, 3], [1, 2])).toEqual(false);
  });
});

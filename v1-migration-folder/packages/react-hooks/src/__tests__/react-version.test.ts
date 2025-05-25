import { describe, expect, test } from "vitest";
import { isReactVersionAtLeast } from "../react-version.js";

describe("isReactVersionAtLeast", () => {
  test("should return the correct value", () => {
    expect(isReactVersionAtLeast(18)).toEqual(true);
  });
});

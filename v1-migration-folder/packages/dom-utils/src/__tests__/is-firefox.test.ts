import { describe, expect, test } from "vitest";
import { isFirefox } from "../is-firefox.js";

describe("isFirefox", () => {
  test("should return false since window is not defined", () => {
    expect(isFirefox()).toEqual(false);
  });
});

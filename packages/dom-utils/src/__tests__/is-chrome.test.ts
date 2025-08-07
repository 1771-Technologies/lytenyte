import { describe, expect, test } from "vitest";
import { isChrome } from "../is-chrome.js";

describe("isChrome", () => {
  test("should return false since window is not defined", () => {
    expect(isChrome()).toEqual(false);
  });
});

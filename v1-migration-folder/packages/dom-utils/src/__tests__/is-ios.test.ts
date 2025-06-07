import { describe, expect, test } from "vitest";
import { isIOS } from "../is-ios.js";

describe("isIOS", () => {
  test("should return false because the window is not present", () => {
    expect(isIOS()).toEqual(false);
  });
});

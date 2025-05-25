import { describe, expect, test } from "vitest";
import { isIPhone } from "../is-iphone";

describe("isIPhone", () => {
  test("should return false because the window is not present", () => {
    expect(isIPhone()).toEqual(false);
  });
});

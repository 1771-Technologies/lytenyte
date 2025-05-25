import { describe, expect, test } from "vitest";
import { isMac } from "../is-mac";

describe("isMac", () => {
  test("should return false because the window is not present", () => {
    expect(isMac()).toEqual(false);
  });
});

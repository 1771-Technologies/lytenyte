import { describe, expect, test } from "vitest";
import { isAppleDevice } from "../is-apple-device";

describe("isAppleDevice", () => {
  test("should return false as window is not defined", () => {
    expect(isAppleDevice()).toEqual(false);
  });
});

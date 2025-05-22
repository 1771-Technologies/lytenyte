import { expect, test } from "vitest";
import { isAppleDevice } from "../is-apple-device";

test("isAppleDevice: should return false as window is not defined", () => {
  expect(isAppleDevice()).toEqual(false);
});

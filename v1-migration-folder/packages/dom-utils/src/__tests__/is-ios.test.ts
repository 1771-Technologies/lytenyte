import { expect, test } from "vitest";
import { isIOS } from "../is-ios";

test("isIOS: should return false because the window is not present", () => {
  expect(isIOS()).toEqual(false);
});

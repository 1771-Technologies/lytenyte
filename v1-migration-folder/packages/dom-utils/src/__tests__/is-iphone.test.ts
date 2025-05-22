import { expect, test } from "vitest";
import { isIPhone } from "../is-iphone";

test("isIPhone: should return false because the window is not present", () => {
  expect(isIPhone()).toEqual(false);
});

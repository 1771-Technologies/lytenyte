import { expect, test } from "vitest";
import { isMac } from "../is-mac";

test("isMac: should return false because the window is not present", () => {
  expect(isMac()).toEqual(false);
});

import { expect, test } from "vitest";
import { isChrome } from "../is-chrome";

test("isChrome: should return false since window is not defined", () => {
  expect(isChrome()).toEqual(false);
});

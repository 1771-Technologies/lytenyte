import { expect, test } from "vitest";
import { isFirefox } from "../is-firefox";

test("isFirefox: should return false since window is not defined", () => {
  expect(isFirefox()).toEqual(false);
});

import { expect, test } from "vitest";
import { isReactVersionAtLeast } from "../react-version";

test("isReactVersionAtLeast: should return the correct value", () => {
  expect(isReactVersionAtLeast(18)).toEqual(true);
});

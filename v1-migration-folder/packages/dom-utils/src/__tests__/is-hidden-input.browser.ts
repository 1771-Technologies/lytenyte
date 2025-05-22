import { expect, test } from "vitest";
import { isHiddenInput } from "../is-hidden-input";

test("isHiddenInput: should return the correct result", () => {
  const i = document.createElement("input");
  i.type = "hidden";
  expect(isHiddenInput(i)).toEqual(true);

  i.type = "text";
  expect(isHiddenInput(i)).toEqual(false);

  expect(isHiddenInput(document.createElement("div"))).toEqual(false);
});

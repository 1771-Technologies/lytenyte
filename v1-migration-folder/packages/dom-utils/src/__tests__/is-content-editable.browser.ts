import { expect, test } from "vitest";
import { isContentEditable } from "../is-content-editable";

test("isContentEditable: should return the correct result", () => {
  const el = document.createElement("div");
  el.contentEditable = "true";

  expect(isContentEditable(el)).toEqual(true);

  expect(isContentEditable(null as unknown as HTMLElement)).toEqual(false);
});

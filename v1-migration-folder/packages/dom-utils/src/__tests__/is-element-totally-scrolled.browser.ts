import { expect, test } from "vitest";
import { isElementTotallyScrolled } from "../is-element-totally-scrolled";

test("isElementTotalScrolled: should return the correct result", () => {
  const div = document.createElement("div");
  div.style.height = `${200}px`;
  div.style.width = `${200}px`;
  div.style.overflow = "auto";

  expect(isElementTotallyScrolled(div)).toEqual(true);

  document.body.appendChild(div);

  const child = document.createElement("div");
  child.style.height = "2000px";
  child.style.width = "2000px";

  div.appendChild(child);

  expect(isElementTotallyScrolled(div)).toEqual(false);

  div.scrollBy({ top: 2300 });
  expect(isElementTotallyScrolled(div)).toEqual(true);

  expect(isElementTotallyScrolled(null as unknown as HTMLElement)).toEqual(false);
});

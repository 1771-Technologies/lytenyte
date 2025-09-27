import { describe, expect, test } from "vitest";
import { isElementVisible } from "../is-element-visible.js";

describe("isElementVisible", () => {
  test("when the element is visible it should return true", async () => {
    const div = document.createElement("div");
    div.getClientRects = () => [] as any;

    div.style.width = "200px";
    document.body.appendChild(div);

    expect(isElementVisible(div)).toEqual(true);

    div.style.width = "0px";
    await expect.element(div).toHaveStyle("width: 0px");

    expect(isElementVisible(div)).toEqual(false);

    div.style.height = "200px";
    await expect.element(div).toHaveStyle("height: 200px");
    expect(isElementVisible(div)).toEqual(true);

    div.style.height = "0px";
    await expect.element(div).toHaveStyle("height: 0px");
    expect(isElementVisible(div)).toEqual(false);
    div.getClientRects = () => [{}] as any;
    expect(isElementVisible(div)).toEqual(true);
  });

  test("when the element provided is not an HTML element it should return false", () => {
    expect(isElementVisible({} as any)).toEqual(false);
  });
});

import { describe, expect, test } from "vitest";
import { isShadowRoot } from "../is-shadow-root.js";

describe("isShadowRoot", () => {
  test("when the element provided is a shadow root it should return true", () => {
    const div = document.createElement("div");
    const root = div.attachShadow({ mode: "open" });

    expect(isShadowRoot(root)).toEqual(true);
    expect(isShadowRoot(div)).toEqual(false);
  });

  test("when the element provided is not a node it should return false", () => {
    expect(isShadowRoot({})).toEqual(false);
  });
});

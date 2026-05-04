import { describe, expect, test } from "vitest";
import { isShadowRoot } from "./is-shadow-root.js";

describe("isShadowRoot", () => {
  test("Should return true when the value is a shadow root and false for regular elements", () => {
    const div = document.createElement("div");
    const root = div.attachShadow({ mode: "open" });

    expect(isShadowRoot(root)).toEqual(true);
    expect(isShadowRoot(div)).toEqual(false);
  });

  test("Should return false when the value is not a node", () => {
    expect(isShadowRoot({})).toEqual(false);
  });
});

import { describe, expect, test } from "vitest";
import { isTabbable } from "../is-tabbable.js";

describe("isTabbable", () => {
  test("when the element is not defined it should false", () => {
    expect(isTabbable(null)).toEqual(false);
  });
  test("when the element is defined and has a positive tab index it should return true", () => {
    const d = document.createElement("div");
    d.tabIndex = 1;

    expect(isTabbable(d)).toEqual(true);
  });

  test("when the element is tabbable it should return true", () => {
    const v = document.createElement("button");

    document.body.appendChild(v);

    expect(isTabbable(v)).toEqual(true);
  });

  test("when the element should be tabbable but has a negative tab index return false", () => {
    const v = document.createElement("button");
    v.tabIndex = -1;
    document.body.appendChild(v);
    expect(isTabbable(v)).toEqual(false);
  });
});

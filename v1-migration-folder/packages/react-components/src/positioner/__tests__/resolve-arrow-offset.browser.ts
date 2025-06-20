import { describe, expect, test } from "vitest";
import { resolveArrowOffset } from "../resolve-arrow-offset.js";

describe("resolveArrowOffset", () => {
  test("should return the correct value", () => {
    expect(resolveArrowOffset(null, "bottom")).toEqual(0);

    const el = document.createElement("div");
    el.style.width = "10px";
    el.style.height = "5px";
    document.body.appendChild(el);

    expect(resolveArrowOffset(el, "bottom")).toEqual(5);
    expect(resolveArrowOffset(el, "top")).toEqual(5);
    expect(resolveArrowOffset(el, "start")).toEqual(10);
    expect(resolveArrowOffset(el, "end")).toEqual(10);
  });
});

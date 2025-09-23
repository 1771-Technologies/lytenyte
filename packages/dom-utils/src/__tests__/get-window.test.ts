import { describe, expect, test, vi } from "vitest";
import { getWindow } from "../get-window.js";

describe("getWindow", () => {
  test("when the element is a shadow root it should return the window of its host", () => {
    const parent = document.createElement("div");
    const root = parent.attachShadow({ mode: "open" });

    expect(getWindow(root)).toEqual(window);
  });

  test("when the element is the document element it should return the default view or window", () => {
    const defaultView = {};
    vi.spyOn(document, "defaultView", "get").mockImplementationOnce(() => defaultView as any);

    expect(getWindow(document)).toBe(defaultView);
    vi.spyOn(document, "defaultView", "get").mockImplementationOnce(() => null as any);
    expect(getWindow(document)).toBe(window);
  });

  test("when the element is provided it should return the default view or window of the owner", () => {
    const defaultView = {};
    vi.spyOn(document, "defaultView", "get").mockImplementationOnce(() => defaultView as any);

    const el = document.createElement("div");

    vi.spyOn(el, "ownerDocument", "get").mockImplementationOnce(() => null as any);

    expect(getWindow(el)).toBe(window);
    expect(getWindow(el)).toBe(defaultView);
    expect(getWindow(el)).toBe(window);
  });

  test("when an invalid value is provided the window value should be returned", () => {
    expect(getWindow(null)).toBe(window);
  });
});

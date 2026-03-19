import { describe, expect, test, vi } from "vitest";
import { getWindow } from "./get-window.js";

describe("getWindow", () => {
  test("Should return the window of the shadow root's host element", () => {
    const parent = document.createElement("div");
    const root = parent.attachShadow({ mode: "open" });

    expect(getWindow(root)).toEqual(window);
  });

  test("Should return the defaultView or global window when passed a document", () => {
    const defaultView = {};
    vi.spyOn(document, "defaultView", "get").mockImplementationOnce(() => defaultView as any);

    expect(getWindow(document)).toBe(defaultView);
    vi.spyOn(document, "defaultView", "get").mockImplementationOnce(() => null as any);
    expect(getWindow(document)).toBe(window);
  });

  test("Should return the owner document's defaultView or global window when passed an element", () => {
    const defaultView = {};
    vi.spyOn(document, "defaultView", "get").mockImplementationOnce(() => defaultView as any);

    const el = document.createElement("div");

    vi.spyOn(el, "ownerDocument", "get").mockImplementationOnce(() => null as any);

    expect(getWindow(el)).toBe(window);
    expect(getWindow(el)).toBe(defaultView);
    expect(getWindow(el)).toBe(window);
  });

  test("Should return the global window when an invalid value is passed", () => {
    expect(getWindow(null)).toBe(window);
  });
});

import { describe, test, expect, vi, afterEach } from "vitest";
import * as hasWindowModule from "../has-window.js";
import * as getWindowModule from "../get-window.js";
import { isShadowRoot } from "../is-shadow-root.js";

describe("isShadowRoot", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns false if hasWindow() is false", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(false);

    const result = isShadowRoot({});
    expect(result).toBe(false);
  });

  test("returns false if ShadowRoot is undefined in environment", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    const originalShadowRoot = globalThis.ShadowRoot;
    // @ts-expect-error - we are intentionally removing ShadowRoot
    delete globalThis.ShadowRoot;

    const result = isShadowRoot({});
    expect(result).toBe(false);

    globalThis.ShadowRoot = originalShadowRoot;
  });

  test("returns true if value is an instance of global ShadowRoot", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    const div = document.createElement("div");
    const shadowRoot = div.attachShadow({ mode: "open" });

    expect(isShadowRoot(shadowRoot)).toBe(true);
  });

  test("returns true if value is an instance of getWindow(value).ShadowRoot", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    class CustomShadowRoot {}
    const mockWindow = {
      ShadowRoot: CustomShadowRoot,
    };
    const mockShadow = new CustomShadowRoot();

    vi.spyOn(getWindowModule, "getWindow").mockReturnValue(mockWindow as unknown as any);

    expect(isShadowRoot(mockShadow)).toBe(true);
  });

  test("returns false for non-ShadowRoot values when hasWindow is true and ShadowRoot exists", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    expect(isShadowRoot(null)).toBe(false);
    expect(isShadowRoot({})).toBe(false);
    expect(isShadowRoot("shadow")).toBe(false);
  });
});

import { describe, expect, test, vi } from "vitest";
import { isWebKit } from "./is-webkit.js";

describe("isWebKit", () => {
  test("Should return the correct result based on CSS WebKit support", () => {
    vi.stubGlobal("CSS", { supports: false });
    expect(isWebKit()).toEqual(false);
    vi.stubGlobal("CSS", { supports: () => true });
    expect(isWebKit()).toEqual(true);
    vi.unstubAllGlobals();
  });
});

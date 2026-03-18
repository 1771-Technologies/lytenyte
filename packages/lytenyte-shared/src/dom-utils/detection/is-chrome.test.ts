import { describe, expect, test, vi } from "vitest";
import { isChrome } from "./is-chrome.js";

describe("isChrome", () => {
  test("Should return the correct result", () => {
    vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
      platform: "Chrome",
      brands: [],
    }));

    vi.spyOn(window.navigator, "userAgent", "get").mockImplementationOnce(() => "Chrome");

    expect(isChrome()).toEqual(true);
    isChrome.__clear();

    vi.spyOn(window.navigator, "userAgent", "get").mockImplementationOnce(() => "Not");
    vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
      platform: "Not",
      brands: [],
    }));

    expect(isChrome()).toEqual(false);
  });
});

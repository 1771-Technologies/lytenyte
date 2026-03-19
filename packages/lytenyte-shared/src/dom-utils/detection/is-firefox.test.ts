import { describe, expect, test, vi } from "vitest";
import { isFirefox } from "./is-firefox.js";

describe("isFirefox", () => {
  test("Should return the correct result", () => {
    vi.spyOn(window.navigator, "userAgent", "get").mockImplementationOnce(() => "Firefox");

    if (window.navigator?.userAgentData)
      vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
        platform: "Firefox",
        brands: [],
      }));

    expect(isFirefox()).toEqual(true);
    isFirefox.__clear();

    vi.spyOn(window.navigator, "userAgent", "get").mockImplementationOnce(() => "Fx");
    if (window.navigator?.userAgentData)
      vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
        platform: "Note",
        brands: [],
      }));
    expect(isFirefox()).toEqual(false);
  });
});

import { describe, expect, test, vi } from "vitest";
import { isIPad } from "./is-ipad.js";

describe("isIPad", () => {
  test("Should return the correct result", () => {
    vi.spyOn(window.navigator, "userAgent", "get").mockImplementationOnce(() => "iPad");
    vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
      platform: "iPad",
      brands: [],
    }));

    expect(isIPad()).toEqual(true);
    isIPad.__clear();

    vi.spyOn(window.navigator, "userAgent", "get").mockImplementationOnce(() => "Fx");
    vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
      platform: "Note",
      brands: [],
    }));
    expect(isIPad()).toEqual(false);
  });
});

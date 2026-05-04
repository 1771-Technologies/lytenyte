import { describe, expect, test, vi } from "vitest";
import { isIPad } from "./is-ipad.js";

describe("isIPad", () => {
  test("Should return the correct result", () => {
    vi.spyOn(window.navigator, "platform", "get").mockImplementationOnce(() => "iPad");
    if (window.navigator?.userAgentData)
      vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
        platform: "iPad",
        brands: [],
      }));

    expect(isIPad()).toEqual(true);
    isIPad.__clear();

    vi.spyOn(window.navigator, "platform", "get").mockImplementationOnce(() => "Fx");
    if (window.navigator?.userAgentData)
      vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
        platform: "Note",
        brands: [],
      }));
    expect(isIPad()).toEqual(false);
  });
});

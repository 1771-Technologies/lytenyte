import { describe, expect, test, vi } from "vitest";
import { isIPhone } from "./is-iphone.js";

describe("isiPhone", () => {
  test("Should return the correct result", () => {
    vi.spyOn(window.navigator, "platform", "get").mockImplementationOnce(() => "iPhone");

    if (window.navigator?.userAgentData)
      vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
        platform: "iPhone",
        brands: [],
      }));

    expect(isIPhone()).toEqual(true);
    isIPhone.__clear();

    vi.spyOn(window.navigator, "platform", "get").mockImplementationOnce(() => "Fx");
    if (window.navigator?.userAgentData)
      vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
        platform: "Note",
        brands: [],
      }));
    expect(isIPhone()).toEqual(false);
  });
});

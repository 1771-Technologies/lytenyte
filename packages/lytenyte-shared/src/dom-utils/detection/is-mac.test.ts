import { describe, expect, test, vi } from "vitest";
import { isMac } from "./is-mac.js";

describe("isMac", () => {
  test("Should return the correct result when the device is mac", () => {
    vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
      platform: "Mac",
      brands: [],
    }));

    expect(isMac()).toEqual(true);
  });
});

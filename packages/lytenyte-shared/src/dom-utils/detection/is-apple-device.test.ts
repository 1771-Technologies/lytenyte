import { describe, test, vi } from "vitest";
import { isAppleDevice } from "./is-apple-device.js";
import { isMac } from "./is-mac.js";

describe("isAppleDevice", () => {
  test("Should return the correct result when the device is an apple device", () => {
    vi.spyOn(window.navigator, "userAgent", "get").mockImplementationOnce(() => "Mac");
    if (window.navigator?.userAgentData)
      vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
        platform: "MacL",
        brands: [],
      }));

    isAppleDevice.__clear();
    isMac.__clear();
    vi.clearAllMocks();

    vi.spyOn(window.navigator, "userAgent", "get").mockImplementationOnce(() => "iOS");
    if (window.navigator?.userAgentData)
      vi.spyOn(window.navigator, "userAgentData", "get").mockImplementation(() => ({
        platform: "iOS",
        brands: [],
      }));
  });
});

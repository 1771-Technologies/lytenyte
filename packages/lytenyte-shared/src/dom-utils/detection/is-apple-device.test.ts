import { describe, expect, test, vi } from "vitest";
import { isAppleDevice } from "./is-apple-device.js";
import { isMac } from "./is-mac.js";

describe("isAppleDevice", () => {
  test("Should return the correct result when the device is an apple device", () => {
    vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
      platform: "MacL",
      brands: [],
    }));

    expect(isAppleDevice()).toEqual(true);
    isAppleDevice.__clear();
    isMac.__clear();

    vi.clearAllMocks();
    vi.spyOn(window.navigator, "userAgentData", "get").mockImplementation(() => ({
      platform: "iOS",
      brands: [],
    }));

    expect(isAppleDevice()).toEqual(true);
  });
});

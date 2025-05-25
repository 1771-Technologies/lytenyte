import { expect, test, beforeEach, afterEach, describe } from "vitest";
import { isIPad } from "../is-ipad.js";

// Helper to override navigator properties
function setNavigatorProperties({
  platform,
  maxTouchPoints,
  userAgentDataPlatform,
}: {
  platform?: string;
  maxTouchPoints?: number;
  userAgentDataPlatform?: string;
}) {
  if (platform !== undefined) {
    Object.defineProperty(navigator, "platform", {
      value: platform,
      configurable: true,
    });
  }

  if (maxTouchPoints !== undefined) {
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: maxTouchPoints,
      configurable: true,
    });
  }

  if (userAgentDataPlatform !== undefined) {
    Object.defineProperty(navigator, "userAgentData", {
      value: { platform: userAgentDataPlatform },
      configurable: true,
    });
  } else {
    Object.defineProperty(navigator, "userAgentData", {
      value: undefined,
      configurable: true,
    });
  }
}

const originalPlatform = navigator.platform;
const originalMaxTouchPoints = navigator.maxTouchPoints;
const originalUserAgentData = navigator.userAgentData;

describe("isIPad", () => {
  beforeEach(() => {
    // Reset the isIPad cache before each test (assuming cached exposes .clear)
    isIPad.__clear?.();
  });

  afterEach(() => {
    setNavigatorProperties({
      platform: originalPlatform,
      maxTouchPoints: originalMaxTouchPoints,
      userAgentDataPlatform: originalUserAgentData?.platform,
    });
  });

  test("returns true when userAgentData.platform is 'iPad'", () => {
    setNavigatorProperties({
      userAgentDataPlatform: "iPad",
      platform: "MacIntel", // fallback
      maxTouchPoints: 0,
    });

    expect(isIPad()).toBe(true);
  });

  test("returns true when platform is 'iPad'", () => {
    setNavigatorProperties({
      platform: "iPad",
      maxTouchPoints: 0,
      userAgentDataPlatform: undefined,
    });

    expect(isIPad()).toBe(true);
  });

  test("returns true for iPadOS masquerading as Mac with touch", () => {
    setNavigatorProperties({
      platform: "MacIntel",
      maxTouchPoints: 5,
      userAgentDataPlatform: "MacIntel",
    });

    expect(isIPad()).toBe(true);
  });

  test("returns false for Mac without touch", () => {
    setNavigatorProperties({
      platform: "MacIntel",
      maxTouchPoints: 0,
      userAgentDataPlatform: "MacIntel",
    });

    expect(isIPad()).toBe(false);
  });

  test("returns false for Windows", () => {
    setNavigatorProperties({
      platform: "Win32",
      maxTouchPoints: 1,
      userAgentDataPlatform: "Win32",
    });

    expect(isIPad()).toBe(false);
  });
});

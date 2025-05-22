import { expect, test, beforeEach, afterEach } from "vitest";
import { isIPad } from "../is-ipad";

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

test("isIPad: returns true when userAgentData.platform is 'iPad'", () => {
  setNavigatorProperties({
    userAgentDataPlatform: "iPad",
    platform: "MacIntel", // fallback
    maxTouchPoints: 0,
  });

  expect(isIPad()).toBe(true);
});

test("isIPad: returns true when platform is 'iPad'", () => {
  setNavigatorProperties({
    platform: "iPad",
    maxTouchPoints: 0,
    userAgentDataPlatform: undefined,
  });

  expect(isIPad()).toBe(true);
});

test("isIPad: returns true for iPadOS masquerading as Mac with touch", () => {
  setNavigatorProperties({
    platform: "MacIntel",
    maxTouchPoints: 5,
    userAgentDataPlatform: "MacIntel",
  });

  expect(isIPad()).toBe(true);
});

test("isIPad: returns false for Mac without touch", () => {
  setNavigatorProperties({
    platform: "MacIntel",
    maxTouchPoints: 0,
    userAgentDataPlatform: "MacIntel",
  });

  expect(isIPad()).toBe(false);
});

test("isIPad: returns false for Windows", () => {
  setNavigatorProperties({
    platform: "Win32",
    maxTouchPoints: 1,
    userAgentDataPlatform: "Win32",
  });

  expect(isIPad()).toBe(false);
});

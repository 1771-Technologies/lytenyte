import { expect, test, afterEach } from "vitest";
import { testUserAgent } from "../test-user-agent";

// Helper to override navigator properties
function setNavigatorOverrides({
  userAgent,
  userAgentDataBrands,
}: {
  userAgent?: string;
  userAgentDataBrands?: { brand: string }[];
}) {
  if (userAgent !== undefined) {
    Object.defineProperty(navigator, "userAgent", {
      value: userAgent,
      configurable: true,
    });
  }

  if (userAgentDataBrands !== undefined) {
    Object.defineProperty(navigator, "userAgentData", {
      value: { brands: userAgentDataBrands },
      configurable: true,
    });
  } else {
    Object.defineProperty(navigator, "userAgentData", {
      value: undefined,
      configurable: true,
    });
  }
}

const originalUserAgent = navigator.userAgent;
const originalUserAgentData = navigator.userAgentData;

afterEach(() => {
  setNavigatorOverrides({
    userAgent: originalUserAgent,
    userAgentDataBrands: originalUserAgentData?.brands,
  });
});

test("testUserAgent: returns true if a brand in userAgentData matches", () => {
  setNavigatorOverrides({
    userAgent: "ignored",
    userAgentDataBrands: [{ brand: "NotChrome" }, { brand: "AppleWebKit" }],
  });

  expect(testUserAgent(/AppleWebKit/)).toBe(true);
});

test("testUserAgent: returns false if no brands in userAgentData match", () => {
  setNavigatorOverrides({
    userAgent: "ignored",
    userAgentDataBrands: [{ brand: "Edge" }, { brand: "FakeBrowser" }],
  });

  expect(testUserAgent(/WebKit/)).toBe(false);
});

test("testUserAgent: falls back to userAgent if userAgentData is not present", () => {
  setNavigatorOverrides({
    userAgent: "Mozilla/5.0 AppleWebKit/537.36 Chrome/112.0.0.0",
    userAgentDataBrands: undefined,
  });

  expect(testUserAgent(/AppleWebKit/)).toBe(true);
});

test("testUserAgent: returns false if neither userAgentData nor userAgent match", () => {
  setNavigatorOverrides({
    userAgent: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)",
    userAgentDataBrands: [{ brand: "OtherBrand" }],
  });

  expect(testUserAgent(/Chrome/)).toBe(false);
});

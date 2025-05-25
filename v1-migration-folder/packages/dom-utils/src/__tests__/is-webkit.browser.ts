import { expect, test, afterEach, describe } from "vitest";
import { isWebKit } from "../is-webkit.js";

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

describe("isWebkit", () => {
  afterEach(() => {
    setNavigatorOverrides({
      userAgent: originalUserAgent,
      userAgentDataBrands: originalUserAgentData?.brands,
    });
  });

  test("returns true if a brand in userAgentData matches", () => {
    setNavigatorOverrides({
      userAgent: "ignored",
      userAgentDataBrands: [{ brand: "NotChrome" }, { brand: "AppleWebKit" }],
    });

    expect(isWebKit()).toBe(false);
  });
});

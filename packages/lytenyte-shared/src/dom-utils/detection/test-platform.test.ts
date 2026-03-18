import { describe, expect, test, vi } from "vitest";
import { testPlatform } from "./test-platform.js";

describe("testPlatform", () => {
  test("Should return the correct result", () => {
    vi.spyOn(window, "navigator", "get").mockImplementationOnce(() => null as any);
    expect(testPlatform(/x/)).toEqual(false);

    vi.spyOn(window, "navigator", "get").mockImplementationOnce(
      () =>
        ({
          userAgentData: { brands: [], platform: "" },
        }) as any,
    );
    expect(testPlatform(/x/)).toEqual(false);

    vi.spyOn(window, "navigator", "get").mockImplementation(
      () =>
        ({
          userAgentData: { platform: false },
          platform: "x",
        }) as any,
    );
    expect(testPlatform(/x/)).toEqual(true);
    vi.clearAllMocks();
  });
});

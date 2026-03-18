import { describe, expect, test, vi } from "vitest";
import { testUserAgent } from "./test-user-agent.js";

describe("testUserAgent", () => {
  test("Should return the correct result", () => {
    vi.spyOn(window, "navigator", "get").mockImplementationOnce(() => null as any);
    expect(testUserAgent(/x/)).toEqual(false);

    vi.spyOn(window, "navigator", "get").mockImplementationOnce(
      () =>
        ({
          userAgentData: { brands: [], platform: "" },
        }) as any,
    );
    expect(testUserAgent(/x/)).toEqual(false);
  });
});

import { describe, expect, test, vi } from "vitest";
import { isIOS } from "./index.js";

describe("isIOS", () => {
  test("Should return true when the platform is iOS", () => {
    expect(isIOS()).toEqual(false);

    vi.stubGlobal("navigator", { platform: "MacIntel", maxTouchPoints: 2 });
    expect(isIOS()).toEqual(true);

    vi.unstubAllGlobals();
  });
});

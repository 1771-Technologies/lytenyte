import { expect, test, vi } from "vitest";
import { isIOS } from "../is-ios.js";

test("if the platform is IOS should return true", () => {
  expect(isIOS()).toEqual(false);

  vi.stubGlobal("navigator", { platform: "MacIntel", maxTouchPoints: 2 });
  expect(isIOS()).toEqual(true);

  vi.unstubAllGlobals();
});

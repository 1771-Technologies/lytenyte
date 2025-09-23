import { expect, test, vi } from "vitest";
import { isWebKit } from "../is-webkit.js";

test("when webkit it should return the correct result", () => {
  vi.stubGlobal("CSS", { supports: false });
  expect(isWebKit()).toEqual(false);
  vi.stubGlobal("CSS", { supports: () => true });
  expect(isWebKit()).toEqual(true);
  vi.unstubAllGlobals();
});

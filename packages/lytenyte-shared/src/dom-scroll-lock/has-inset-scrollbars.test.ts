import { describe, expect, test, vi } from "vitest";
import { hasInsetScrollbars } from "./has-inset-scrollbars.js";

describe("hasInsetScrollbars", () => {
  test("Should return true if the scrollbars are inset", () => {
    vi.spyOn(document.documentElement, "clientWidth", "get").mockImplementationOnce(() => 200);
    vi.spyOn(window, "innerWidth", "get").mockImplementationOnce(() => 220);

    expect(hasInsetScrollbars(document.body)).toEqual(true);
  });

  test("Should return false if the scrollbars are not inset", () => {
    vi.spyOn(document.documentElement, "clientWidth", "get").mockImplementationOnce(() => 200);
    vi.spyOn(window, "innerWidth", "get").mockImplementationOnce(() => 180);

    expect(hasInsetScrollbars(document.body)).toEqual(false);
  });
});

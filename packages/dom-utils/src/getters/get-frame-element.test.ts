import { describe, expect, test, vi } from "vitest";
import { getFrameElement } from "./get-frame-element.js";

describe("getFrameElement", () => {
  test("Should return the correct frame element", () => {
    vi.spyOn(window, "parent", "get").mockImplementation(() => ({ frameElement: "x" }) as any);
    vi.spyOn(window, "frameElement", "get").mockImplementation(() => "x" as any);
    expect(getFrameElement(window)).toEqual("x");
    vi.clearAllMocks();
    vi.spyOn(window, "parent", "get").mockImplementation(() => null as any);
    expect(getFrameElement(window)).toEqual(null);
    vi.clearAllMocks();
  });
});

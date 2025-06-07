import { describe, it, expect } from "vitest";
import { getWindow } from "../get-window";

describe("getWindow", () => {
  it("should return the defaultView from node's ownerDocument", () => {
    const mockWindow = {} as Window;
    const mockNode = {
      ownerDocument: {
        defaultView: mockWindow,
      },
    };

    expect(getWindow(mockNode)).toBe(mockWindow);
  });

  it("should return global window if ownerDocument is missing", () => {
    const mockNode = {};

    expect(getWindow(mockNode)).toBe(window);
  });

  it("should return global window if node is null or undefined", () => {
    expect(getWindow(null)).toBe(window);
    expect(getWindow(undefined)).toBe(window);
  });
});

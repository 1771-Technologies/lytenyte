import { describe, expect, test } from "vitest";
import { maxColumnDepth } from "./max-column-depth.js";

describe("maxColumnDepth", () => {
  test("Should return 0 when groupVisible is empty and filledDepth is false", () => {
    expect(maxColumnDepth([], [], false)).toBe(0);
  });

  test("Should return 0 when allVisible is empty and filledDepth is true", () => {
    expect(maxColumnDepth([], [], true)).toBe(0);
  });

  test("Should return 0 when columns have no groupPath", () => {
    const cols = [{ id: "col1" }, { id: "col2" }];
    expect(maxColumnDepth(cols, cols, false)).toBe(0);
  });

  test("Should return the length of groupPath as the depth for a single column", () => {
    const cols = [{ id: "col1", groupPath: ["A", "B", "C"] }];
    expect(maxColumnDepth(cols, cols, false)).toBe(3);
  });

  test("Should use groupVisible when filledDepth is false", () => {
    const groupVisible = [{ id: "col1", groupPath: ["A"] }];
    const allVisible = [
      { id: "col1", groupPath: ["A"] },
      { id: "col2", groupPath: ["A", "B", "C"] },
    ];

    expect(maxColumnDepth(groupVisible, allVisible, false)).toBe(1);
  });

  test("Should use allVisible when filledDepth is true", () => {
    const groupVisible = [{ id: "col1", groupPath: ["A"] }];
    const allVisible = [
      { id: "col1", groupPath: ["A"] },
      { id: "col2", groupPath: ["A", "B", "C"] },
    ];

    expect(maxColumnDepth(groupVisible, allVisible, true)).toBe(3);
  });

  test("Should treat a missing groupPath as depth 0", () => {
    const cols = [{ id: "col1" }, { id: "col2", groupPath: ["A", "B"] }];
    expect(maxColumnDepth(cols, cols, false)).toBe(2);
  });
});

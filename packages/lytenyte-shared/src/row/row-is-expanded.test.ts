import { describe, expect, test } from "vitest";
import { rowIsExpanded } from "./row-is-expanded.js";

describe("rowIsExpanded", () => {
  test("Should return the correct result", () => {
    expect(rowIsExpanded({ kind: "branch", expanded: false } as any)).toEqual(false);
    expect(rowIsExpanded({ kind: "branch", expanded: true } as any)).toEqual(true);
    expect(rowIsExpanded({ kind: "leaf", expanded: true } as any)).toEqual(false);
  });
});

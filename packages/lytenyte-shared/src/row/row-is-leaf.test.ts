import { describe, expect, test } from "vitest";
import { rowIsLeaf } from "./row-is-leaf.js";

describe("rowIsBranch", () => {
  test("Should return the correct result", () => {
    expect(rowIsLeaf({ kind: "aggregated" } as any)).toEqual(false);
    expect(rowIsLeaf({ kind: "leaf" } as any)).toEqual(true);
  });
});

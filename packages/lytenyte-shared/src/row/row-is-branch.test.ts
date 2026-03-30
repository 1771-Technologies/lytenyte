import { describe, expect, test } from "vitest";
import { rowIsBranch } from "./row-is-branch.js";

describe("rowIsBranch", () => {
  test("Should return the correct result", () => {
    expect(rowIsBranch({ kind: "aggregated" } as any)).toEqual(false);
    expect(rowIsBranch({ kind: "branch" } as any)).toEqual(true);
  });
});

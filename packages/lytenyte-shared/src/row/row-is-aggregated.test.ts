import { describe, expect, test } from "vitest";
import { rowIsAggregated } from "./row-is-aggregated.js";

describe("rowIsAggregated", () => {
  test("Should return the correct result", () => {
    expect(rowIsAggregated({ kind: "branch" } as any)).toEqual(false);
    expect(rowIsAggregated({ kind: "aggregated" } as any)).toEqual(true);
  });
});

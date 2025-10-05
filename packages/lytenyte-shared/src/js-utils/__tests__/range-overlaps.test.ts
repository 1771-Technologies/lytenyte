import { describe, expect, test } from "vitest";
import { rangesOverlap } from "../ranges-overlap.js";

describe("rangeOverlaps", () => {
  test("should return the correct result", () => {
    expect(rangesOverlap(2, 4, 3, 6)).toEqual(true);
    expect(rangesOverlap(3, 8, 3, 6)).toEqual(true);
    expect(rangesOverlap(4, 8, 3, 6)).toEqual(true);
    expect(rangesOverlap(6, 8, 3, 6)).toEqual(false);

    // completely before
    expect(rangesOverlap(2, 4, 4, 8)).toEqual(false);
    // completely after
    expect(rangesOverlap(8, 12, 4, 8)).toEqual(false);
    // start overlaps but end exceeds
    expect(rangesOverlap(4, 12, 2, 8)).toEqual(true);
    // end overlaps but start is out of bounds
    expect(rangesOverlap(4, 12, 6, 8)).toEqual(true);
  });
});

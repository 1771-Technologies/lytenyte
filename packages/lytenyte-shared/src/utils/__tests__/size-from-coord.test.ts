import { describe, expect, test } from "vitest";
import { makePositionArray } from "../../coordinates/make-position-array/make-position-array.js";
import { sizeFromCoord } from "../size-from-coord.js";

describe("sizeFromCoord", () => {
  test("Should return the correct value", () => {
    const positions = makePositionArray(() => 20, 5);
    expect(sizeFromCoord(1, positions)).toEqual(20);
    expect(sizeFromCoord(1, positions, 2)).toEqual(40);
  });
});

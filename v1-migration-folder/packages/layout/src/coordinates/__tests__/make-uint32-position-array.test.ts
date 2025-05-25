import { describe, expect, test } from "vitest";
import { makeUint32PositionArray } from "../make-uint32-position-array.js";

describe("makeUint32PositionArray", () => {
  test("should handle fix and variable sizes", () => {
    expect(makeUint32PositionArray(() => 20, 5)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      40,
      60,
      80,
      100,
    ]
  `);

    expect(makeUint32PositionArray((i) => [20, 40, 60][i % 3], 6)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      60,
      120,
      140,
      180,
      240,
    ]
  `);
  });

  test("should treat negative values as 0", () => {
    const widths = [20, -10, 10, 40];

    expect(makeUint32PositionArray((i) => widths[i], 4)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      20,
      30,
      70,
    ]
  `);
  });
});

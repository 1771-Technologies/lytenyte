import { expect, test } from "vitest";
import { getBoundEnd } from "../get-bound-end.js";

test("getBoundEnd: should return the correct values", () => {
  const positions = new Uint32Array([0, 30, 60, 90, 120]);

  expect(getBoundEnd(positions, 0, 5, 60, 0)).toEqual(3);
  expect(getBoundEnd(positions, 0, 5, 61, 1)).toEqual(4);
  expect(getBoundEnd(positions, 20, 5, 60, 0)).toEqual(3);
  expect(getBoundEnd(positions, 20, 5, 60, 1)).toEqual(4);
  expect(getBoundEnd(positions, 90, 5, 60, 0)).toEqual(5);
  expect(getBoundEnd(positions, 90, 5, 60, 2)).toEqual(5);

  const positionsVariables = new Uint32Array([0, 30, 100, 150, 250]);
  expect(getBoundEnd(positionsVariables, 0, 5, 60, 0)).toEqual(2);
  expect(getBoundEnd(positionsVariables, 0, 5, 60, 1)).toEqual(3);
  expect(getBoundEnd(positionsVariables, 30, 5, 60, 1)).toEqual(3);
  expect(getBoundEnd(positionsVariables, 50, 5, 60, 1)).toEqual(4);
  expect(getBoundEnd(positionsVariables, 150, 5, 60, 1)).toEqual(5);
  expect(getBoundEnd(positionsVariables, 200, 5, 60, 1)).toEqual(5);
  expect(getBoundEnd(positionsVariables, 260, 5, 60, 1)).toEqual(5);
});

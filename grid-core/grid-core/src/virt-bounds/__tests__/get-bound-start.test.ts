import { getBoundStart } from "../get-bound-start.js";

test("getBoundStart should return the correct bound values", () => {
  const positions = new Uint32Array([0, 30, 60, 90, 120]);

  expect(getBoundStart(positions, 20, 0, 0, 4)).toEqual(0);
  expect(getBoundStart(positions, 40, 0, 0, 4)).toEqual(1);
  expect(getBoundStart(positions, 40, 1, 0, 4)).toEqual(0);

  const positionsVariables = new Uint32Array([0, 30, 100, 150, 250]);
  expect(getBoundStart(positionsVariables, 120, 0, 0, 4)).toEqual(2);
  expect(getBoundStart(positionsVariables, 170, 0, 0, 4)).toEqual(3);
  expect(getBoundStart(positionsVariables, 260, 0, 0, 4)).toEqual(4);
  expect(getBoundStart(positionsVariables, 290, 1, 0, 4)).toEqual(3);
  expect(getBoundStart(positionsVariables, -20, 1, 0, 4)).toEqual(0);

  expect(getBoundStart(positions, 20, 0, 2, 4)).toEqual(2);
  expect(getBoundStart(positions, 400, 0, 2, 4)).toEqual(4);
});

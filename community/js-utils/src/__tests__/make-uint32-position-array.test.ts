import { makeUint32PositionArray } from "../make-uint32-position-array.js";

test("makeUint32PositionArray", () => {
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

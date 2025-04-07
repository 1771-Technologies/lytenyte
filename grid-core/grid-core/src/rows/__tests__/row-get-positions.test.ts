import { rowGetPositions } from "../row-get-positions";

test("should return the correct row positions", () => {
  expect(rowGetPositions(4, 20, null, null)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      40,
      60,
      80,
    ]
  `);

  expect(rowGetPositions(4, (i) => i * 10 + 10, null, null)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      10,
      30,
      60,
      100,
    ]
  `);

  expect(
    rowGetPositions(
      4,
      20,
      () => true,
      () => 20,
    ),
  ).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      40,
      80,
      120,
      160,
    ]
  `);
});

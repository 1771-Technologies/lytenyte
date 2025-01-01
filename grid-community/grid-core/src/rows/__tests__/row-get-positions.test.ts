import { rowGetPositions } from "../row-get-positions";

test("should return the correct row positions", () => {
  expect(rowGetPositions(4, 20, {}, 10, null, null)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      40,
      60,
      80,
    ]
  `);

  expect(rowGetPositions(4, (i) => i * 10 + 10, {}, 10, null, null)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      10,
      30,
      60,
      100,
    ]
  `);

  expect(rowGetPositions(4, "auto", { 0: 50 }, 20, null, null)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      50,
      70,
      90,
      110,
    ]
  `);

  expect(
    rowGetPositions(
      4,
      20,
      {},
      10,
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

  expect(
    rowGetPositions(
      4,
      "auto",
      { 0: 50, 2: 30 },
      20,
      (i) => i % 2 === 1,
      () => 20,
    ),
  ).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      50,
      90,
      120,
      160,
    ]
  `);
});

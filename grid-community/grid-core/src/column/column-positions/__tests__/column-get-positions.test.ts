import { columnGetPositions } from "../column-get-positions.js";

test("should create the correct positions", () => {
  expect(
    columnGetPositions(
      [
        { id: "A", width: 200 },
        { id: "B", width: 100 },
        { id: "C", width: 150 },
        { id: "D", width: 300 },
      ],
      {},
      {},
      500,
    ),
  ).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      200,
      300,
      450,
      750,
    ]
  `);

  expect(
    columnGetPositions(
      [
        { id: "A", width: 100, widthFlex: 1 },
        { id: "B", width: 200, widthFlex: 0 },
        { id: "C", width: 100, widthFlex: 1 },
      ],
      {},
      null,
      500,
    ),
  ).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      150,
      350,
      500,
    ]
  `);
  expect(
    columnGetPositions(
      [
        { id: "A", width: 100, widthFlex: 1 },
        { id: "B", width: 200, widthFlex: 0 },
        { id: "C", width: 100, widthFlex: 1 },
      ],
      {},
      null,
      501,
    ),
  ).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      150,
      350,
      500,
    ]
  `);
});

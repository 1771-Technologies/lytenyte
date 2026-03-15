import { describe, expect, test } from "vitest";
import { columnPositions } from "./column-positions.js";
import type { ColumnAbstract } from "../../types.js";

describe("columnPositions", () => {
  test("Should return a single zero position for empty columns", () => {
    expect(columnPositions([], {}, 0, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
    ]
  `);
  });

  test("Should produce a position array with length one greater than the number of columns", () => {
    const result = columnPositions(
      [
        { id: "x", width: 100 },
        { id: "y", width: 200 },
      ],
      {},
      0,
      false,
    );
    expect(result.length).toBe(3);
    expect(result[0]).toBe(0);
  });

  test("Should compute cumulative positions from left to right", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 200 },
      { id: "y", width: 200 },
      { id: "z", width: 100 },
      { id: "w", width: 80 },
    ];

    expect(columnPositions(columns, {}, 0, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      200,
      400,
      500,
      580,
    ]
  `);
  });

  test("Should clamp column widths to their min and max before computing positions", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 200, widthMax: 150 },
      { id: "y", width: 200, widthMin: 300 },
      { id: "z", width: 100, widthMax: 200, widthMin: 50 },
      { id: "t", width: 80 },
    ];

    expect(columnPositions(columns, {}, 0, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      150,
      450,
      550,
      630,
    ]
  `);
  });

  test("Should use the hardcoded default widthMin of 80 when neither column nor base specifies one", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 200, widthMax: 150 },
      { id: "y", width: 200, widthMin: 300 },
      { id: "z", width: 100, widthMax: 200, widthMin: 50 },
      { id: "t", width: 50 },
    ];

    expect(columnPositions(columns, {}, 0, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      150,
      450,
      550,
      630,
    ]
  `);
  });

  test("Should use base widthMin and widthMax as fallbacks when column does not specify them", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 200, widthMax: 150 },
      { id: "y", width: 200, widthMin: 300 },
      { id: "z", width: 100, widthMax: 200, widthMin: 50 },
      { id: "t", width: 50 },
    ];

    expect(columnPositions(columns, { widthMax: 250, widthMin: 50 }, 0, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      150,
      400,
      500,
      550,
    ]
  `);
  });

  test("Should clamp a negative column width to zero", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: -100, widthMin: -30, widthMax: 120 },
      { id: "y", width: 100 },
      { id: "t", width: 100 },
      { id: "z", width: 200 },
    ];

    expect(columnPositions(columns, {}, 973, false)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        0,
        100,
        200,
        400,
      ]
    `);
  });

  test("Should use the default column width of 200 when no width is specified", () => {
    const columns: ColumnAbstract[] = [
      { id: "x" },
      { id: "y", width: 100 },
      { id: "z", width: 100 },
      { id: "t", width: 200 },
    ];

    expect(columnPositions(columns, {}, 973, false)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        200,
        300,
        400,
        600,
      ]
    `);
  });

  test("Should not adjust positions when sizeToFit is false even if columns overflow the container", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 300 },
      { id: "y", width: 300 },
    ];

    expect(columnPositions(columns, {}, 400, false)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        300,
        600,
      ]
    `);
  });

  test("Should give all free space to a single flex column proportional to its flex value", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 100, widthFlex: 2 },
      { id: "y", width: 100 },
      { id: "z", width: 100 },
      { id: "t", width: 200 },
    ];

    expect(columnPositions(columns, {}, 1000, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      600,
      700,
      800,
      1000,
    ]
  `);
  });

  test("Should distribute free space evenly between two equally-flexed columns", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 100, widthFlex: 1 },
      { id: "y", width: 100, widthFlex: 1 },
      { id: "z", width: 100 },
      { id: "t", width: 200 },
    ];

    expect(columnPositions(columns, {}, 1000, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      350,
      700,
      800,
      1000,
    ]
  `);
  });

  test("Should apply base widthFlex to columns that do not specify their own flex value", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 100, widthFlex: 1 },
      { id: "y", width: 100, widthFlex: 1 },
      { id: "w", width: 100 },
      { id: "t", width: 200 },
    ];

    expect(columnPositions(columns, { widthFlex: 2 }, 1000, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      183,
      366,
      632,
      999,
    ]
  `);
  });

  test("Should distribute free space proportionally to different flex ratios including base flex", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 100, widthFlex: 1 },
      { id: "y", width: 100, widthFlex: 3 },
      { id: "w", width: 100 },
      { id: "t", width: 200 },
    ];

    expect(columnPositions(columns, { widthFlex: 2 }, 1000, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      162,
      449,
      674,
      999,
    ]
  `);
  });

  test("Should distribute remainder pixels when free space is not evenly divisible by flex total", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 100, widthFlex: 2 },
      { id: "y", width: 100, widthFlex: 3 },
      { id: "t", width: 100 },
      { id: "z", width: 200 },
    ];

    expect(columnPositions(columns, {}, 973, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      289,
      672,
      772,
      972,
    ]
  `);
  });

  test("Should not distribute bonus pixels when freeSpace leaves a remainder of exactly one after dividing by flex total", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 100, widthFlex: 1 },
      { id: "y", width: 100, widthFlex: 1 },
      { id: "z", width: 100 },
      { id: "t", width: 100 },
    ];

    // freeSpace = 601 - 400 = 201, flexTotal = 2, 201 % 2 = 1
    // remainder = 201 - 200 - 1 = 0, so no bonus pixels are distributed
    // each flex column gets exactly unit (100), final total = 600 = containerWidth - 1
    expect(columnPositions(columns, {}, 601, false)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        200,
        400,
        500,
        600,
      ]
    `);
  });

  test("Should not fire flex expansion when flex columns exist but totalWidth is not less than containerWidth", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 300, widthFlex: 1 },
      { id: "y", width: 300 },
    ];

    // totalWidth (600) > containerWidth (400), so flex branch is skipped
    expect(columnPositions(columns, {}, 400, false)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        300,
        600,
      ]
    `);
  });

  test("Should shrink columns proportionally to fit within the container when sizeToFit is true", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 300 },
      { id: "y", width: 200 },
      { id: "z", width: 300 },
      { id: "t", width: 300 },
    ];

    expect(columnPositions(columns, {}, 973, true)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      265,
      441,
      706,
      972,
    ]
  `);

    const columns2: ColumnAbstract[] = [
      { id: "x", width: 121 },
      { id: "y", width: 421 },
      { id: "t", width: 132 },
      { id: "w", width: 167 },
    ];

    expect(columnPositions(columns2, {}, 1000, true)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      144,
      645,
      801,
      999,
    ]
  `);
  });

  test("Should expand columns proportionally to fill the container when sizeToFit is true and columns underflow", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 300 },
      { id: "y", width: 200 },
      { id: "w", width: 300 },
      { id: "t", width: 300 },
    ];

    expect(columnPositions(columns, {}, 1200, true)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      327,
      546,
      873,
      1199,
    ]
  `);

    expect(columnPositions(columns, {}, 1211, true)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      330,
      551,
      881,
      1210,
    ]
  `);
  });

  test("Should not adjust positions when sizeToFit is true and totalWidth already equals containerWidth", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 300 },
      { id: "y", width: 200 },
    ];

    // totalWidth (500) === containerWidth (500): neither shrink nor expand condition is met
    expect(columnPositions(columns, {}, 500, true)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        300,
        500,
      ]
    `);
  });

  test("Should shrink columns via sizeToFit when flex columns exist but totalWidth exceeds containerWidth", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 300, widthFlex: 1 },
      { id: "y", width: 300 },
    ];

    // flex branch skipped (totalWidth 600 not < containerWidth 400)
    // sizeToFit shrink branch handles it instead
    expect(columnPositions(columns, {}, 400, true)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        199,
        399,
      ]
    `);
  });

  test("Should shrink a single column to fit within the container when sizeToFit is true", () => {
    expect(columnPositions([{ id: "x", width: 500 }], {}, 300, true)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        299,
      ]
    `);
  });

  test("Should expand a single column to fill the container when sizeToFit is true", () => {
    expect(columnPositions([{ id: "x", width: 200 }], {}, 500, true)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        499,
      ]
    `);
  });

  test("Should produce all-zero positions when all column widths are zero and sizeToFit expand would divide by zero", () => {
    const columns: ColumnAbstract[] = [
      { id: "x", width: 0, widthMin: 0 },
      { id: "y", width: 0, widthMin: 0 },
    ];

    // totalWidth = 0, expanding path divides by totalWidth (0/0 = NaN)
    // Uint32Array coerces NaN to 0, so all positions collapse to zero
    expect(columnPositions(columns, {}, 500, true)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        0,
        0,
      ]
    `);
  });
});

import { describe, expect, test } from "vitest";
import { computeColumnPositions } from "../compute-column-positions.js";
import type { ColumnWidthItem } from "../../+types.non-gen.js";

describe("computeColumnPositions", () => {
  test("should handle empty column widths", () => {
    expect(computeColumnPositions([], {}, 0, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
    ]
  `);
  });

  test("should handle standard column widths", () => {
    const widths: ColumnWidthItem[] = [{ width: 200 }, { width: 200 }, { width: 100 }, { width: 80 }];

    expect(computeColumnPositions(widths, {}, 0, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      200,
      400,
      500,
      580,
    ]
  `);
  });

  test("should handle max and min width", () => {
    const widths: ColumnWidthItem[] = [
      { width: 200, widthMax: 150 },
      { width: 200, widthMin: 300 },
      { width: 100, widthMax: 200, widthMin: 50 },
      { width: 80 },
    ];

    expect(computeColumnPositions(widths, {}, 0, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      150,
      450,
      550,
      630,
    ]
  `);
  });

  test("should handle max and min width with provided defaults", () => {
    const widths: ColumnWidthItem[] = [
      { width: 200, widthMax: 150 },
      { width: 200, widthMin: 300 },
      { width: 100, widthMax: 200, widthMin: 50 },
      { width: 50 }, // default min width is 80
    ];

    expect(computeColumnPositions(widths, {}, 0, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      150,
      450,
      550,
      630,
    ]
  `);
  });

  test("should handle max and min width with base defaults", () => {
    const widths: ColumnWidthItem[] = [
      { width: 200, widthMax: 150 },
      { width: 200, widthMin: 300 },
      { width: 100, widthMax: 200, widthMin: 50 },
      { width: 50 }, // default min width is 80
    ];

    expect(computeColumnPositions(widths, { widthMax: 250, widthMin: 50 }, 0, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      150,
      400,
      500,
      550,
    ]
  `);
  });

  test("free ratio should take remaining space", () => {
    const widths: ColumnWidthItem[] = [
      { width: 100, widthFlex: 2 },
      { width: 100 },
      { width: 100 },
      { width: 200 },
    ];

    expect(computeColumnPositions(widths, {}, 1000, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      600,
      700,
      800,
      1000,
    ]
  `);
  });

  test("free ratio should take remaining space", () => {
    const widths: ColumnWidthItem[] = [
      { width: 100, widthFlex: 1 },
      { width: 100, widthFlex: 1 },
      { width: 100 },
      { width: 200 },
    ];

    expect(computeColumnPositions(widths, {}, 1000, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      350,
      700,
      800,
      1000,
    ]
  `);
  });

  test("free ratio should take remaining space", () => {
    const widths: ColumnWidthItem[] = [
      { width: 100, widthFlex: 1 },
      { width: 100, widthFlex: 1 },
      { width: 100 },
      { width: 200 },
    ];

    expect(
      computeColumnPositions(
        widths,
        {
          widthFlex: 2,
        },
        1000,
        false,
      ),
    ).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      183,
      366,
      632,
      999,
    ]
  `);
  });

  test("free ratio should take remaining space", () => {
    const widths: ColumnWidthItem[] = [
      { width: 100, widthFlex: 1 },
      { width: 100, widthFlex: 3 },
      { width: 100 },
      { width: 200 },
    ];

    expect(
      computeColumnPositions(
        widths,
        {
          widthFlex: 2,
        },
        1000,
        false,
      ),
    ).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      162,
      449,
      674,
      999,
    ]
  `);
  });

  test("should handle cases where width is odd numbered", () => {
    const widths: ColumnWidthItem[] = [
      { width: 100, widthFlex: 2 },
      { width: 100, widthFlex: 3 },
      { width: 100 },
      { width: 200 },
    ];

    expect(computeColumnPositions(widths, {}, 973, false)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      289,
      672,
      772,
      972,
    ]
  `);
  });

  test("should handle negative widths", () => {
    const widths: ColumnWidthItem[] = [
      { width: -100, widthMin: -30, widthMax: 120 },
      { width: 100 },
      { width: 100 },
      { width: 200 },
    ];

    expect(computeColumnPositions(widths, {}, 973, false)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        0,
        100,
        200,
        400,
      ]
    `);
  });

  test("should handle overriding the default width", () => {
    const widths: ColumnWidthItem[] = [{}, { width: 100 }, { width: 100 }, { width: 200 }];

    expect(computeColumnPositions(widths, {}, 973, false)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        200,
        300,
        400,
        600,
      ]
    `);
  });

  test("should handle size to fit shrink", () => {
    const widths: ColumnWidthItem[] = [{ width: 300 }, { width: 200 }, { width: 300 }, { width: 300 }];

    expect(computeColumnPositions(widths, {}, 973, true)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      265,
      441,
      706,
      972,
    ]
  `);

    const widths2: ColumnWidthItem[] = [{ width: 121 }, { width: 421 }, { width: 132 }, { width: 167 }];

    expect(computeColumnPositions(widths2, {}, 1000, true)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      144,
      645,
      801,
      999,
    ]
  `);
  });

  test("should handle size to fit expansion", () => {
    const widths: ColumnWidthItem[] = [{ width: 300 }, { width: 200 }, { width: 300 }, { width: 300 }];

    expect(computeColumnPositions(widths, {}, 1200, true)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      327,
      546,
      873,
      1199,
    ]
  `);

    expect(computeColumnPositions(widths, {}, 1211, true)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      330,
      551,
      881,
      1210,
    ]
  `);
  });
});

import { columnEmptyKey } from "../../column-empty-key.js";
import type { ColumnWidthLike } from "../column-get-positions.js";
import { columnGetWidths } from "../column-get-widths.js";

test("should compute the correct width", () => {
  let result = columnGetWidths(
    [
      { id: "x", width: 200 },
      { id: "y", width: 102 },
    ],
    {},
    {},
  );

  expect(result).toMatchInlineSnapshot(`
    {
      "flexTotal": 0,
      "totalWidth": 302,
      "widths": {
        "x": 200,
        "y": 102,
      },
    }
  `);

  result = columnGetWidths(
    [
      { id: "x", widthMin: 200, widthMax: 400, width: 190 },
      { id: "y", widthMin: 200, widthMax: 400, width: 220, widthFlex: 1 },
      { id: "z", widthMin: 200, widthMax: 400, width: 500 },
      { id: "e", width: 200, widthFlex: 2 },
    ],
    {},
    { e: 20 },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "flexTotal": 3,
      "totalWidth": 1040,
      "widths": {
        "e": 220,
        "x": 200,
        "y": 220,
        "z": 400,
      },
    }
  `);

  result = columnGetWidths(
    [
      { id: "x", widthMin: 100, width: 200 } as ColumnWidthLike,
      { id: columnEmptyKey(["y"], null), width: 200 },
      { id: "z" },
    ],
    { widthFlex: 1 },
    null,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "flexTotal": 2,
      "totalWidth": 380,
      "widths": {
        "lytenyte-empty:y|>empty": 30,
        "x": 200,
        "z": 150,
      },
    }
  `);

  result = columnGetWidths(
    [
      { id: "x", widthMin: 100, width: 200 },
      { id: "y", width: 400 },
      { id: "z" },
    ] as ColumnWidthLike[],
    { widthMin: 20, widthMax: 300, width: 200 },
    null,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "flexTotal": 0,
      "totalWidth": 700,
      "widths": {
        "x": 200,
        "y": 300,
        "z": 200,
      },
    }
  `);
});

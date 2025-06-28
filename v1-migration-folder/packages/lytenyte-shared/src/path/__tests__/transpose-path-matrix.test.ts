/*
Copyright 2025 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { transposePathMatrix } from "../transpose-path-table.js";
import { Table } from "@1771technologies/cli-table";
import type { PathMatrixItem } from "../+types.path-table.js";
import { computePathMatrix } from "../compute-path-matrix.js";
import { describe, expect, test } from "vitest";

const mapRowsToStrings = (row: (PathMatrixItem | null)[], useSeen: boolean = false) =>
  row.map((c) => {
    if (!c) return "-";

    return `${useSeen ? c.idOccurrence : c.id}|${c.start} / ${c.end}`;
  });

describe("transposePathTable", () => {
  test("should return the correct table transposed", () => {
    const table = computePathMatrix([
      { id: "x", groupPath: ["A", "B"] },
      { id: "y" },
      { id: "z", groupPath: ["A", "B", "C"] },
      { id: "f", groupPath: ["A", "B", "C"] },
      { id: "g", groupPath: ["A", "F", "C"] },
      { id: "f", groupPath: ["A", "B", "C"] },
      {
        id: "d",
        groupPath: [{ id: "X", joinId: "A" }, { id: "C", joinId: "B" }, { id: "V" }],
      },
      { id: "v", groupPath: ["F"] },
      { id: "x", groupPath: ["F", "B"] },
      { id: "z", groupPath: ["F", "A"] },
      { id: "z", groupPath: ["A", "F", "A"] },
    ]);

    const t = new Table();
    transposePathMatrix(table).forEach((row) => t.push(mapRowsToStrings(row)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    ┌───────────┬───┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬──────────┬───────────┬────────────┬───────────────┐
    │ A|0 / 1   │ - │ A|2 / 7     │ A|2 / 7     │ A|2 / 7     │ A|2 / 7     │ A|2 / 7     │ F|7 / 10 │ F|7 / 10  │ F|7 / 10   │ A|10 / 11     │
    ├───────────┼───┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼──────────┼───────────┼────────────┼───────────────┤
    │ A#B|0 / 1 │ - │ A#B|2 / 4   │ A#B|2 / 4   │ A#F|4 / 5   │ A#B|5 / 7   │ A#B|5 / 7   │ -        │ F#B|8 / 9 │ F#A|9 / 10 │ A#F|10 / 11   │
    ├───────────┼───┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼──────────┼───────────┼────────────┼───────────────┤
    │ -         │ - │ A#B#C|2 / 4 │ A#B#C|2 / 4 │ A#F#C|4 / 5 │ A#B#C|5 / 6 │ X#C#V|6 / 7 │ -        │ -         │ -          │ A#F#A|10 / 11 │
    └───────────┴───┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴──────────┴───────────┴────────────┴───────────────┘"
  `);

    const tOcc = new Table();
    transposePathMatrix(table).forEach((row) => tOcc.push(mapRowsToStrings(row, true)));

    expect(tOcc.toString()).toMatchInlineSnapshot(`
    "
    ┌─────────────┬───┬───────────────┬───────────────┬───────────────┬───────────────┬───────────────┬────────────┬─────────────┬──────────────┬─────────────────┐
    │ A#0|0 / 1   │ - │ A#1|2 / 7     │ A#1|2 / 7     │ A#1|2 / 7     │ A#1|2 / 7     │ A#1|2 / 7     │ F#0|7 / 10 │ F#0|7 / 10  │ F#0|7 / 10   │ A#2|10 / 11     │
    ├─────────────┼───┼───────────────┼───────────────┼───────────────┼───────────────┼───────────────┼────────────┼─────────────┼──────────────┼─────────────────┤
    │ A#B#0|0 / 1 │ - │ A#B#1|2 / 4   │ A#B#1|2 / 4   │ A#F#0|4 / 5   │ A#B#2|5 / 7   │ A#B#2|5 / 7   │ -          │ F#B#0|8 / 9 │ F#A#0|9 / 10 │ A#F#1|10 / 11   │
    ├─────────────┼───┼───────────────┼───────────────┼───────────────┼───────────────┼───────────────┼────────────┼─────────────┼──────────────┼─────────────────┤
    │ -           │ - │ A#B#C#0|2 / 4 │ A#B#C#0|2 / 4 │ A#F#C#0|4 / 5 │ A#B#C#1|5 / 6 │ X#C#V#0|6 / 7 │ -          │ -           │ -            │ A#F#A#0|10 / 11 │
    └─────────────┴───┴───────────────┴───────────────┴───────────────┴───────────────┴───────────────┴────────────┴─────────────┴──────────────┴─────────────────┘"
  `);
  });

  test("should handle empty path table correctly", () => {
    expect(transposePathMatrix([])).toMatchInlineSnapshot(`[]`);
  });
});

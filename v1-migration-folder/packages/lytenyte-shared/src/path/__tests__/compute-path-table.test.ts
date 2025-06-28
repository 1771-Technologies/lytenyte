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

import { computePathTable } from "../compute-path-table.js";
import type { PathTable } from "../+types.path-table.js";
import { Table } from "@1771technologies/cli-table";
import { describe, expect, test } from "vitest";

describe("computePathTable", () => {
  test("should create the correct table", () => {
    const t = computePathTable([
      { id: "x", groupPath: ["A", "B"] },
      { id: "y" },
      { id: "z", groupPath: ["A", "B", "C"] },
      { id: "d", groupPath: ["Y", "X", "C"] },
      { id: "v", groupPath: ["F"] },
    ]);

    expect(toGridTable(t)).toMatchInlineSnapshot(`
    "
    ┌─────┬───┬───────┬───────┬───┐
    │ A   │ y │ A     │ Y     │ F │
    ├─────┤   ├───────┼───────┼───┤
    │ A#B │   │ A#B   │ Y#X   │ v │
    ├─────┤   ├───────┼───────┤   │
    │ x   │   │ A#B#C │ Y#X#C │   │
    │     │   ├───────┼───────┤   │
    │     │   │ z     │ d     │   │
    └─────┴───┴───────┴───────┴───┘"
  `);
  });

  test("should create a flat table when there are no paths", () => {
    const table = computePathTable([
      { id: "x" },
      { id: "y" },
      { id: "z" },
      { id: "f" },
      { id: "g" },
    ]);

    expect(toGridTable(table)).toMatchInlineSnapshot(`
    "
    ┌───┬───┬───┬───┬───┐
    │ x │ y │ z │ f │ g │
    └───┴───┴───┴───┴───┘"
  `);
  });

  test("should compute consecutive group paths", () => {
    const table = computePathTable([
      { id: "x", groupPath: ["A", "B"] },
      { id: "y" },
      { id: "z", groupPath: ["A", "B", "C"] },
      { id: "f", groupPath: ["A", "B", "C"] },
      { id: "g", groupPath: ["A", "B", "C"] },
      { id: "d", groupPath: ["Y", "X", "C"] },
      { id: "v", groupPath: ["F"] },
      { id: "x", groupPath: ["F", "B"] },
      { id: "z", groupPath: ["F", "A"] },
    ]);

    expect(toGridTable(table)).toMatchInlineSnapshot(`
    "
    ┌─────┬───┬───────────┬───────┬───────────────┐
    │ A   │ y │ A         │ Y     │ F             │
    ├─────┤   ├───────────┼───────┼───┬─────┬─────┤
    │ A#B │   │ A#B       │ Y#X   │ v │ F#B │ F#A │
    ├─────┤   ├───────────┼───────┤   ├─────┼─────┤
    │ x   │   │ A#B#C     │ Y#X#C │   │ x   │ z   │
    │     │   ├───┬───┬───┼───────┤   │     │     │
    │     │   │ z │ f │ g │ d     │   │     │     │
    └─────┴───┴───┴───┴───┴───────┴───┴─────┴─────┘"
  `);
  });

  test("should correctly join paths", () => {
    const table = computePathTable([
      { id: "x", groupPath: ["A", "B"] },
      { id: "y" },
      { id: "z", groupPath: ["A", "B", "C"] },
      { id: "f", groupPath: ["A", "B", "C"] },
      { id: "g", groupPath: ["A", "B", "C"] },
      {
        id: "d",
        groupPath: [{ id: "X", joinId: "A" }, { id: "C", joinId: "B" }, { id: "V" }],
      },
      { id: "v", groupPath: ["F"] },
      { id: "x", groupPath: ["F", "B"] },
      { id: "z", groupPath: ["F", "A"] },
    ]);

    expect(toGridTable(table)).toMatchInlineSnapshot(`
    "
    ┌─────┬───┬───────────────────┬───────────────┐
    │ A   │ y │ A                 │ F             │
    ├─────┤   ├───────────────────┼───┬─────┬─────┤
    │ A#B │   │ A#B               │ v │ F#B │ F#A │
    ├─────┤   ├───────────┬───────┤   ├─────┼─────┤
    │ x   │   │ A#B#C     │ X#C#V │   │ x   │ z   │
    │     │   ├───┬───┬───┼───────┤   │     │     │
    │     │   │ z │ f │ g │ d     │   │     │     │
    └─────┴───┴───┴───┴───┴───────┴───┴─────┴─────┘"
  `);
  });

  test("should handle empty rows", () => {
    const table = computePathTable([]);

    expect(toGridTable(table)).toMatchInlineSnapshot(`
    "
    "
  `);
  });

  test("computes the max depth correctly when overridden", () => {
    const table = computePathTable(
      [
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
      ],
      4,
    );

    expect(toGridTable(table)).toMatchInlineSnapshot(`
    "
    ┌─────┬───┬───────────────────────────────┬───────────────┬───────┐
    │ A   │ y │ A                             │ F             │ A     │
    ├─────┤   ├───────┬───────┬───────────────┼───┬─────┬─────┼───────┤
    │ A#B │   │ A#B   │ A#F   │ A#B           │ v │ F#B │ F#A │ A#F   │
    ├─────┤   ├───────┼───────┼───────┬───────┤   ├─────┼─────┼───────┤
    │ x   │   │ A#B#C │ A#F#C │ A#B#C │ X#C#V │   │ x   │ z   │ A#F#A │
    │     │   ├───┬───┼───────┼───────┼───────┤   │     │     ├───────┤
    │     │   │ z │ f │ g     │ f     │ d     │   │     │     │ z     │
    │     │   │   │   │       │       │       │   │     │     │       │
    │     │   │   │   │       │       │       │   │     │     │       │
    └─────┴───┴───┴───┴───────┴───────┴───────┴───┴─────┴─────┴───────┘"
  `);

    // There should be 5 rows only and not a 6th.
    expect(table.table.length === 5);
  });

  test("should handle a single path", () => {
    const table = computePathTable([{ id: "x", groupPath: ["V"] }]);
    expect(toGridTable(table)).toMatchInlineSnapshot(`
    "
    ┌───┐
    │ V │
    ├───┤
    │ x │
    └───┘"
  `);
  });

  test("should handle really long paths", () => {
    const table = computePathTable([
      { id: "x", groupPath: ["A", "B", "C", "D", "E", "V", "A", "T", "A"] },
      { id: "v", groupPath: [] },
      { id: "t", groupPath: ["A", "B"] },
    ]);
    expect(toGridTable(table)).toMatchInlineSnapshot(`
    "
    ┌───────────────────┬───┬─────┐
    │ A                 │ v │ A   │
    ├───────────────────┤   ├─────┤
    │ A#B               │   │ A#B │
    ├───────────────────┤   ├─────┤
    │ A#B#C             │   │ t   │
    ├───────────────────┤   │     │
    │ A#B#C#D           │   │     │
    ├───────────────────┤   │     │
    │ A#B#C#D#E         │   │     │
    ├───────────────────┤   │     │
    │ A#B#C#D#E#V       │   │     │
    ├───────────────────┤   │     │
    │ A#B#C#D#E#V#A     │   │     │
    ├───────────────────┤   │     │
    │ A#B#C#D#E#V#A#T   │   │     │
    ├───────────────────┤   │     │
    │ A#B#C#D#E#V#A#T#A │   │     │
    ├───────────────────┤   │     │
    │ x                 │   │     │
    └───────────────────┴───┴─────┘"
  `);
  });

  function toGridTable(t: PathTable<any>) {
    const rows: any = Array.from({ length: t.maxRow }, () => {
      return Array.from({ length: t.maxCol }, () => null);
    });

    t.table.forEach((r, ri) => {
      r.forEach((x, ci) => {
        rows[x.rowStart][ci] = { content: x.data.id, colSpan: x.colSpan, rowSpan: x.rowSpan };

        for (let r = ri; r < x.rowStart + x.rowSpan && r < t.maxRow; r++) {
          for (let c = ci + 1; c < x.colStart + x.colSpan && c < t.maxCol; c++) {
            rows[r][c] = null;
          }
        }
      });
    });

    for (let i = t.maxRow - 1; i >= 0; i--) {
      for (let j = t.maxCol - 1; j >= 0; j--) {
        if (rows[i][j] === null) rows[i].pop();
      }
    }

    const table = new Table();
    table.push(...rows);

    return table.toString();
  }
});

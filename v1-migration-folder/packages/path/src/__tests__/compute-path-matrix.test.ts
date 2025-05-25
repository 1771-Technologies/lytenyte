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

import { Table } from "@1771technologies/cli-table";
import { describe, expect, test } from "vitest";
import type { PathMatrixItem } from "../+types.path-table.js";
import { computePathMatrix } from "../compute-path-matrix.js";

const mapRowsToStrings = (row: (PathMatrixItem | null)[], useSeen: boolean = false) =>
  row.map((c) => {
    if (!c) return "-";

    return `${useSeen ? c.idOccurrence : c.id}|${c.start} / ${c.end}`;
  });

describe("computePathMatrix", () => {
  test("should create the correct table", () => {
    const table = computePathMatrix([
      { id: "x", groupPath: ["A", "B"] },
      { id: "y" },
      { id: "z", groupPath: ["A", "B", "C"] },
      { id: "d", groupPath: ["Y", "X", "C"] },
      { id: "v", groupPath: ["F"] },
    ]);

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    ┌─────────┬───────────┬─────────────┐
    │ A|0 / 1 │ A#B|0 / 1 │ -           │
    ├─────────┼───────────┼─────────────┤
    │ -       │ -         │ -           │
    ├─────────┼───────────┼─────────────┤
    │ A|2 / 3 │ A#B|2 / 3 │ A#B#C|2 / 3 │
    ├─────────┼───────────┼─────────────┤
    │ Y|3 / 4 │ Y#X|3 / 4 │ Y#X#C|3 / 4 │
    ├─────────┼───────────┼─────────────┤
    │ F|4 / 5 │ -         │ -           │
    └─────────┴───────────┴─────────────┘"
  `);
  });

  test("should be able to join two top level items", () => {
    const table = computePathMatrix([
      { id: "x", groupPath: ["A", "B"] },
      { id: "y", groupPath: ["A", "B"] },
      { id: "c", groupPath: [{ id: "V", joinId: "A" }, "C"] },
      { id: "v" },
    ]);

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    ┌─────────┬───────────┐
    │ A|0 / 3 │ A#B|0 / 2 │
    ├─────────┼───────────┤
    │ A|0 / 3 │ A#B|0 / 2 │
    ├─────────┼───────────┤
    │ A|0 / 3 │ V#C|2 / 3 │
    ├─────────┼───────────┤
    │ -       │ -         │
    └─────────┴───────────┘"
  `);

    expect(table.at(0)!.at(0)?.idsInNode).toMatchInlineSnapshot(`
    Set {
      "A",
      "V",
    }
  `);
  });

  test("handles the case where there are no group paths", () => {
    const table = computePathMatrix([
      { id: "x" },
      { id: "y" },
      { id: "z" },
      { id: "f" },
      { id: "g" },
    ]);

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    "
  `);
  });

  test("should compute consecutive group paths", () => {
    const table = computePathMatrix([
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

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    ┌─────────┬───────────┬─────────────┐
    │ A|0 / 1 │ A#B|0 / 1 │ -           │
    ├─────────┼───────────┼─────────────┤
    │ -       │ -         │ -           │
    ├─────────┼───────────┼─────────────┤
    │ A|2 / 5 │ A#B|2 / 5 │ A#B#C|2 / 5 │
    ├─────────┼───────────┼─────────────┤
    │ A|2 / 5 │ A#B|2 / 5 │ A#B#C|2 / 5 │
    ├─────────┼───────────┼─────────────┤
    │ A|2 / 5 │ A#B|2 / 5 │ A#B#C|2 / 5 │
    ├─────────┼───────────┼─────────────┤
    │ Y|5 / 6 │ Y#X|5 / 6 │ Y#X#C|5 / 6 │
    ├─────────┼───────────┼─────────────┤
    │ F|6 / 9 │ -         │ -           │
    ├─────────┼───────────┼─────────────┤
    │ F|6 / 9 │ F#B|7 / 8 │ -           │
    ├─────────┼───────────┼─────────────┤
    │ F|6 / 9 │ F#A|8 / 9 │ -           │
    └─────────┴───────────┴─────────────┘"
  `);
  });

  test("should correctly join on paths", () => {
    const table = computePathMatrix([
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

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    ┌─────────┬───────────┬─────────────┐
    │ A|0 / 1 │ A#B|0 / 1 │ -           │
    ├─────────┼───────────┼─────────────┤
    │ -       │ -         │ -           │
    ├─────────┼───────────┼─────────────┤
    │ A|2 / 6 │ A#B|2 / 6 │ A#B#C|2 / 5 │
    ├─────────┼───────────┼─────────────┤
    │ A|2 / 6 │ A#B|2 / 6 │ A#B#C|2 / 5 │
    ├─────────┼───────────┼─────────────┤
    │ A|2 / 6 │ A#B|2 / 6 │ A#B#C|2 / 5 │
    ├─────────┼───────────┼─────────────┤
    │ A|2 / 6 │ A#B|2 / 6 │ X#C#V|5 / 6 │
    ├─────────┼───────────┼─────────────┤
    │ F|6 / 9 │ -         │ -           │
    ├─────────┼───────────┼─────────────┤
    │ F|6 / 9 │ F#B|7 / 8 │ -           │
    ├─────────┼───────────┼─────────────┤
    │ F|6 / 9 │ F#A|8 / 9 │ -           │
    └─────────┴───────────┴─────────────┘"
  `);

    const idSet = table[2][0]?.idsInNode;
    expect(idSet).toMatchInlineSnapshot(`
    Set {
      "A",
      "X",
    }
  `);

    const idSet2 = table[2][1]?.idsInNode;
    expect(idSet2).toMatchInlineSnapshot(`
    Set {
      "A#B",
      "X#C",
    }
  `);

    const idSet3 = table[2][2]?.idsInNode;
    expect(idSet3).toMatchInlineSnapshot(`
    Set {
      "A#B#C",
    }
  `);
  });

  test("should handle the case where there are no groups", () => {
    const table = computePathMatrix([
      { id: "x" },
      { id: "y" },
      { id: "z" },
      { id: "d" },
      { id: "v" },
    ]);

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    "
  `);
  });

  test("should handle empty items", () => {
    const table = computePathMatrix([]);

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row)));
    expect(t.toString()).toMatchInlineSnapshot(`
    "
    "
  `);
  });

  test("should correctly compute seen ids", () => {
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
    table.forEach((row) => t.push(mapRowsToStrings(row, true)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    ┌─────────────┬───────────────┬─────────────────┐
    │ A#0|0 / 1   │ A#B#0|0 / 1   │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ -           │ -             │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#B#1|2 / 4   │ A#B#C#0|2 / 4   │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#B#1|2 / 4   │ A#B#C#0|2 / 4   │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#F#0|4 / 5   │ A#F#C#0|4 / 5   │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#B#2|5 / 7   │ A#B#C#1|5 / 6   │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#B#2|5 / 7   │ X#C#V#0|6 / 7   │
    ├─────────────┼───────────────┼─────────────────┤
    │ F#0|7 / 10  │ -             │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ F#0|7 / 10  │ F#B#0|8 / 9   │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ F#0|7 / 10  │ F#A#0|9 / 10  │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#2|10 / 11 │ A#F#1|10 / 11 │ A#F#A#0|10 / 11 │
    └─────────────┴───────────────┴─────────────────┘"
  `);
  });

  test("should correctly compute seen ids when a seen record is passed in.", () => {
    const table = computePathMatrix(
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
      undefined,
      { "A#B": 2 },
    );

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row, true)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    ┌─────────────┬───────────────┬─────────────────┐
    │ A#0|0 / 1   │ A#B#3|0 / 1   │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ -           │ -             │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#B#4|2 / 4   │ A#B#C#0|2 / 4   │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#B#4|2 / 4   │ A#B#C#0|2 / 4   │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#F#0|4 / 5   │ A#F#C#0|4 / 5   │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#B#5|5 / 7   │ A#B#C#1|5 / 6   │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#B#5|5 / 7   │ X#C#V#0|6 / 7   │
    ├─────────────┼───────────────┼─────────────────┤
    │ F#0|7 / 10  │ -             │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ F#0|7 / 10  │ F#B#0|8 / 9   │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ F#0|7 / 10  │ F#A#0|9 / 10  │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#2|10 / 11 │ A#F#1|10 / 11 │ A#F#A#0|10 / 11 │
    └─────────────┴───────────────┴─────────────────┘"
  `);
  });

  test("computes the max depth correctly when overridden", () => {
    const table = computePathMatrix(
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

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row, true)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    ┌─────────────┬───────────────┬─────────────────┬───┐
    │ A#0|0 / 1   │ A#B#0|0 / 1   │ -               │ - │
    ├─────────────┼───────────────┼─────────────────┼───┤
    │ -           │ -             │ -               │ - │
    ├─────────────┼───────────────┼─────────────────┼───┤
    │ A#1|2 / 7   │ A#B#1|2 / 4   │ A#B#C#0|2 / 4   │ - │
    ├─────────────┼───────────────┼─────────────────┼───┤
    │ A#1|2 / 7   │ A#B#1|2 / 4   │ A#B#C#0|2 / 4   │ - │
    ├─────────────┼───────────────┼─────────────────┼───┤
    │ A#1|2 / 7   │ A#F#0|4 / 5   │ A#F#C#0|4 / 5   │ - │
    ├─────────────┼───────────────┼─────────────────┼───┤
    │ A#1|2 / 7   │ A#B#2|5 / 7   │ A#B#C#1|5 / 6   │ - │
    ├─────────────┼───────────────┼─────────────────┼───┤
    │ A#1|2 / 7   │ A#B#2|5 / 7   │ X#C#V#0|6 / 7   │ - │
    ├─────────────┼───────────────┼─────────────────┼───┤
    │ F#0|7 / 10  │ -             │ -               │ - │
    ├─────────────┼───────────────┼─────────────────┼───┤
    │ F#0|7 / 10  │ F#B#0|8 / 9   │ -               │ - │
    ├─────────────┼───────────────┼─────────────────┼───┤
    │ F#0|7 / 10  │ F#A#0|9 / 10  │ -               │ - │
    ├─────────────┼───────────────┼─────────────────┼───┤
    │ A#2|10 / 11 │ A#F#1|10 / 11 │ A#F#A#0|10 / 11 │ - │
    └─────────────┴───────────────┴─────────────────┴───┘"
  `);
  });

  test("should ignore max depth override ", () => {
    const table = computePathMatrix(
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
      2,
    );

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row, true)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    ┌─────────────┬───────────────┬─────────────────┐
    │ A#0|0 / 1   │ A#B#0|0 / 1   │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ -           │ -             │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#B#1|2 / 4   │ A#B#C#0|2 / 4   │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#B#1|2 / 4   │ A#B#C#0|2 / 4   │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#F#0|4 / 5   │ A#F#C#0|4 / 5   │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#B#2|5 / 7   │ A#B#C#1|5 / 6   │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#1|2 / 7   │ A#B#2|5 / 7   │ X#C#V#0|6 / 7   │
    ├─────────────┼───────────────┼─────────────────┤
    │ F#0|7 / 10  │ -             │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ F#0|7 / 10  │ F#B#0|8 / 9   │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ F#0|7 / 10  │ F#A#0|9 / 10  │ -               │
    ├─────────────┼───────────────┼─────────────────┤
    │ A#2|10 / 11 │ A#F#1|10 / 11 │ A#F#A#0|10 / 11 │
    └─────────────┴───────────────┴─────────────────┘"
  `);
  });

  test("should handle paths at the edges", () => {
    const table = computePathMatrix([
      { id: "x", groupPath: ["A"] },
      { id: "v" },
      { id: "x", groupPath: ["A"] },
    ]);

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row, true)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    ┌───────────┐
    │ A#0|0 / 1 │
    ├───────────┤
    │ -         │
    ├───────────┤
    │ A#1|2 / 3 │
    └───────────┘"
  `);
  });

  test("should handle a single path", () => {
    const table = computePathMatrix([{ id: "x", groupPath: ["V"] }]);

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row, true)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    ┌───────────┐
    │ V#0|0 / 1 │
    └───────────┘"
  `);
  });

  test("should handle really long paths", () => {
    const table = computePathMatrix([
      { id: "x", groupPath: ["A", "B", "C", "D", "E", "V", "A", "T", "A"] },
      { id: "v", groupPath: [] },
      { id: "t", groupPath: ["A", "B"] },
    ]);

    const t = new Table();
    table.forEach((row) => t.push(mapRowsToStrings(row, true)));

    expect(t.toString()).toMatchInlineSnapshot(`
    "
    ┌───────────┬─────────────┬───────────────┬─────────────────┬───────────────────┬─────────────────────┬───────────────────────┬─────────────────────────┬───────────────────────────┐
    │ A#0|0 / 1 │ A#B#0|0 / 1 │ A#B#C#0|0 / 1 │ A#B#C#D#0|0 / 1 │ A#B#C#D#E#0|0 / 1 │ A#B#C#D#E#V#0|0 / 1 │ A#B#C#D#E#V#A#0|0 / 1 │ A#B#C#D#E#V#A#T#0|0 / 1 │ A#B#C#D#E#V#A#T#A#0|0 / 1 │
    ├───────────┼─────────────┼───────────────┼─────────────────┼───────────────────┼─────────────────────┼───────────────────────┼─────────────────────────┼───────────────────────────┤
    │ -         │ -           │ -             │ -               │ -                 │ -                   │ -                     │ -                       │ -                         │
    ├───────────┼─────────────┼───────────────┼─────────────────┼───────────────────┼─────────────────────┼───────────────────────┼─────────────────────────┼───────────────────────────┤
    │ A#1|2 / 3 │ A#B#1|2 / 3 │ -             │ -               │ -                 │ -                   │ -                     │ -                       │ -                         │
    └───────────┴─────────────┴───────────────┴─────────────────┴───────────────────┴─────────────────────┴───────────────────────┴─────────────────────────┴───────────────────────────┘"
  `);
  });
});

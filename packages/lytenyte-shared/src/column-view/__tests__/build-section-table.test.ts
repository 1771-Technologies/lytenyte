import { describe, expect, test } from "vitest";
import { buildSectionTable } from "../build-section-table";
import type { ColumnAbstract } from "../../types";

function build(
  section: ColumnAbstract[],
  maxDepth: number,
  opts: {
    lastGroupShouldFill?: boolean;
    seenMap?: Record<string, number>;
    pathDelimiter?: string;
    colOffset?: number;
  } = {},
) {
  return buildSectionTable(
    section,
    maxDepth,
    opts.lastGroupShouldFill ?? false,
    opts.seenMap ?? {},
    opts.pathDelimiter ?? "/",
    opts.colOffset ?? 0,
  );
}

function allCells(table: ReturnType<typeof buildSectionTable>) {
  return table.flat();
}

function leaves(table: ReturnType<typeof buildSectionTable>) {
  return allCells(table).filter((c) => c.kind === "leaf");
}

function groups(table: ReturnType<typeof buildSectionTable>) {
  return allCells(table).filter((c) => c.kind === "group");
}

function leafFor(table: ReturnType<typeof buildSectionTable>, id: string) {
  return leaves(table).find((c) => c.kind === "leaf" && c.data.id === id) ?? null;
}

function groupFor(table: ReturnType<typeof buildSectionTable>, groupId: string) {
  return groups(table).find((c) => c.kind === "group" && c.data.id === groupId) ?? null;
}

describe("BuildSectionTable", () => {
  test("Should return an empty array for an empty section", () => {
    expect(build([], 0)).toEqual([]);
    expect(build([], 3)).toEqual([]);
  });

  test("Should produce one row with one leaf for a single ungrouped column", () => {
    const table = build([{ id: "a" }], 0);
    expect(table).toHaveLength(1);
    expect(table[0]).toHaveLength(1);
    expect(table[0][0]).toMatchObject({ kind: "leaf", rowStart: 0, colStart: 0, rowSpan: 1, colSpan: 1 });
  });

  test("Should place ungrouped leaves at sequential colStart positions", () => {
    const table = build([{ id: "a" }, { id: "b" }, { id: "c" }], 0);
    expect(leaves(table).map((l) => l.colStart)).toEqual([0, 1, 2]);
  });

  test("Should produce exactly maxDepth+1 rows", () => {
    expect(build([{ id: "a" }], 0)).toHaveLength(1);
    expect(build([{ id: "a" }], 1)).toHaveLength(2);
    expect(build([{ id: "a" }], 3)).toHaveLength(4);
  });

  test("Should span an ungrouped leaf across the full height when maxDepth > 0", () => {
    const table = build([{ id: "a" }], 2);
    const leaf = leafFor(table, "a")!;
    expect(leaf.rowStart).toBe(0);
    expect(leaf.rowSpan).toBe(3);
  });

  test("Should shift leaf colStart values by colOffset", () => {
    const table = build([{ id: "a" }, { id: "b" }], 0, { colOffset: 5 });
    const ls = leaves(table);
    expect(ls[0].colStart).toBe(5);
    expect(ls[1].colStart).toBe(6);
  });

  test("Should shift group colStart by colOffset", () => {
    const table = build(
      [
        { id: "a", groupPath: ["Sports"] },
        { id: "b", groupPath: ["Sports"] },
      ],
      1,
      { colOffset: 3 },
    );
    expect(groupFor(table, "Sports")!.colStart).toBe(3);
  });

  test("Should merge adjacent columns with the same groupPath into one group cell", () => {
    const table = build(
      [
        { id: "a", groupPath: ["Sports"] },
        { id: "b", groupPath: ["Sports"] },
      ],
      1,
    );
    const gs = groups(table);
    expect(gs).toHaveLength(1);
    expect(gs[0]).toMatchObject({ kind: "group", rowStart: 0, colStart: 0, colSpan: 2, rowSpan: 1 });
  });

  test("Should place a single-level group cell at row 0", () => {
    const table = build([{ id: "a", groupPath: ["X"] }], 1);
    expect(groupFor(table, "X")!.rowStart).toBe(0);
  });

  test("Should place the leaf directly below its group", () => {
    const table = build([{ id: "a", groupPath: ["X"] }], 1);
    const leaf = leafFor(table, "a")!;
    expect(leaf.rowStart).toBe(1);
    expect(leaf.rowSpan).toBe(1);
  });

  test("Should produce separate group cells for different groupPaths", () => {
    const table = build(
      [
        { id: "a", groupPath: ["Sports"] },
        { id: "b", groupPath: ["News"] },
      ],
      1,
    );
    const gs = groups(table);
    expect(gs).toHaveLength(2);
    expect(gs.map((g) => g.data.id).sort()).toEqual(["News", "Sports"]);
  });

  test("Should produce one group row per depth level for a multi-level path", () => {
    const table = build([{ id: "a", groupPath: ["A", "B"] }], 2);
    expect(table).toHaveLength(3);
    expect(groupFor(table, "A")).not.toBeNull();
    expect(groupFor(table, "A/B")).not.toBeNull();
    expect(leafFor(table, "a")).not.toBeNull();
  });

  test("Should place group cells at their correct row depth", () => {
    const table = build([{ id: "a", groupPath: ["A", "B", "C"] }], 3);
    expect(groupFor(table, "A")!.rowStart).toBe(0);
    expect(groupFor(table, "A/B")!.rowStart).toBe(1);
    expect(groupFor(table, "A/B/C")!.rowStart).toBe(2);
    expect(leafFor(table, "a")!.rowStart).toBe(3);
  });

  test("Should set colSpan based on how many columns share a group at each depth", () => {
    const table = build(
      [
        { id: "a", groupPath: ["X", "Y"] },
        { id: "b", groupPath: ["X"] },
      ],
      2,
    );
    expect(groupFor(table, "X")!.colSpan).toBe(2);
    expect(groupFor(table, "X/Y")!.colSpan).toBe(1);
  });

  test("Should produce separate group cells for non-adjacent columns with the same groupPath", () => {
    const table = build(
      [{ id: "a", groupPath: ["Sports"] }, { id: "x" }, { id: "b", groupPath: ["Sports"] }],
      1,
    );
    const gs = groups(table).filter((g) => g.data.id === "Sports");
    expect(gs).toHaveLength(2);
    expect(gs[0].colSpan).toBe(1);
    expect(gs[1].colSpan).toBe(1);
  });

  test("Should produce globally unique idOccurrence values across calls sharing a seenMap", () => {
    const seenMap: Record<string, number> = {};
    const table1 = build([{ id: "a", groupPath: ["Sports"] }], 1, { seenMap });
    const table2 = build([{ id: "b", groupPath: ["Sports"] }], 1, { seenMap });

    const g1 = groups(table1)[0];
    const g2 = groups(table2)[0];

    expect(g1.data.id).toBe(g2.data.id);
    expect(g1.data.idOccurrence).not.toBe(g2.data.idOccurrence);
  });

  test("Should use the provided pathDelimiter in group ids", () => {
    const table = build([{ id: "a", groupPath: ["A", "B"] }], 2, { pathDelimiter: "#" });
    expect(groupFor(table, "A#B")).not.toBeNull();
    expect(groupFor(table, "A/B")).toBeNull();
  });

  test("Should fill the leaf upward from where its path ends when lastGroupShouldFill is false", () => {
    const table = build(
      [
        { id: "a", groupPath: ["X", "Y"] },
        { id: "b", groupPath: ["X"] },
      ],
      2,
      { lastGroupShouldFill: false },
    );
    const leafB = leafFor(table, "b")!;
    expect(leafB.rowStart).toBe(1);
    expect(leafB.rowSpan).toBe(2);
  });

  test("Should keep group rowSpan at 1 when lastGroupShouldFill is false", () => {
    const table = build(
      [
        { id: "a", groupPath: ["X", "Y"] },
        { id: "b", groupPath: ["X"] },
      ],
      2,
      { lastGroupShouldFill: false },
    );
    for (const g of groups(table)) {
      expect(g.rowSpan).toBe(1);
    }
  });

  test("Should place all leaves at the same row for symmetric paths when lastGroupShouldFill is false", () => {
    const table = build(
      [
        { id: "a", groupPath: ["A", "B"] },
        { id: "b", groupPath: ["X", "Y"] },
      ],
      2,
      { lastGroupShouldFill: false },
    );
    expect(leafFor(table, "a")!.rowStart).toBe(2);
    expect(leafFor(table, "b")!.rowStart).toBe(2);
  });

  test("Should place ungrouped leaf at full height regardless of lastGroupShouldFill", () => {
    const table = build([{ id: "a" }, { id: "b", groupPath: ["X"] }], 1, { lastGroupShouldFill: false });
    const leafA = leafFor(table, "a")!;
    expect(leafA.rowStart).toBe(0);
    expect(leafA.rowSpan).toBe(2);
  });

  test("Should place grouped leaf at the bottom row when lastGroupShouldFill is true", () => {
    const table = build(
      [
        { id: "a", groupPath: ["X", "Y"] },
        { id: "b", groupPath: ["X"] },
      ],
      2,
      { lastGroupShouldFill: true },
    );
    const leafB = leafFor(table, "b")!;
    expect(leafB.rowStart).toBe(2);
    expect(leafB.rowSpan).toBe(1);
  });

  test("Should extend the last group rowSpan to fill the gap when lastGroupShouldFill is true", () => {
    const table = build(
      [
        { id: "a", groupPath: ["X", "Y"] },
        { id: "b", groupPath: ["X"] },
      ],
      2,
      { lastGroupShouldFill: true },
    );
    expect(groupFor(table, "X")!.rowSpan).toBe(2);
  });

  test("Should still span ungrouped leaves at full height when lastGroupShouldFill is true", () => {
    const table = build([{ id: "a" }, { id: "b", groupPath: ["X"] }], 1, { lastGroupShouldFill: true });
    const leafA = leafFor(table, "a")!;
    expect(leafA.rowStart).toBe(0);
    expect(leafA.rowSpan).toBe(2);
  });

  test("Should not extend group rowSpan when there is no gap between the group and the leaf row", () => {
    const table = build([{ id: "a", groupPath: ["X", "Y"] }], 2, { lastGroupShouldFill: true });
    expect(leafFor(table, "a")!.rowStart).toBe(2);
    expect(groupFor(table, "X/Y")!.rowSpan).toBe(1);
  });

  test("Should fill multiple rows when the gap is large and lastGroupShouldFill is true", () => {
    const table = build(
      [
        { id: "a", groupPath: ["X", "Y", "Z"] },
        { id: "b", groupPath: ["X"] },
      ],
      3,
      { lastGroupShouldFill: true },
    );
    expect(groupFor(table, "X")!.rowSpan).toBe(3);
    expect(leafFor(table, "b")!.rowStart).toBe(3);
    expect(leafFor(table, "b")!.rowSpan).toBe(1);
  });

  test("Should have no effect from lastGroupShouldFill when maxDepth is 0", () => {
    const table = build([{ id: "a" }], 0, { lastGroupShouldFill: true });
    const leaf = leafFor(table, "a")!;
    expect(leaf.rowStart).toBe(0);
    expect(leaf.rowSpan).toBe(1);
  });

  test("Should produce exactly one leaf per column", () => {
    const section = [{ id: "a", groupPath: ["X"] }, { id: "b" }, { id: "c", groupPath: ["X", "Y"] }];
    expect(leaves(build(section, 2))).toHaveLength(3);
  });

  test("Should place each leaf in exactly one row with no duplicates", () => {
    const table = build([{ id: "a", groupPath: ["X"] }, { id: "b" }], 1);
    const leafIds = leaves(table).map((l) => l.data.id);
    expect(new Set(leafIds).size).toBe(leafIds.length);
  });

  test("Should place each group in exactly one row with no duplicate idOccurrence values", () => {
    const table = build(
      [
        { id: "a", groupPath: ["X", "Y"] },
        { id: "b", groupPath: ["X", "Y"] },
      ],
      2,
    );
    const occurrences = groups(table).map((g) => g.data.idOccurrence);
    expect(new Set(occurrences).size).toBe(occurrences.length);
  });
});

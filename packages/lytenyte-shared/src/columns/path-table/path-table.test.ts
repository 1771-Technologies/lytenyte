import { describe, expect, test } from "vitest";
import { pathTable } from "./path-table.js";
import type { ColumnAbstract } from "../../types.js";

function pt(
  sections: { start?: ColumnAbstract[]; center?: ColumnAbstract[]; end?: ColumnAbstract[] },
  maxDepth: number,
  opts: { lastShouldFill?: boolean; joinDelimiter?: string } = {},
) {
  return pathTable(
    { start: sections.start ?? [], center: sections.center ?? [], end: sections.end ?? [] },
    maxDepth,
    opts.lastShouldFill ?? false,
    opts.joinDelimiter ?? "/",
  );
}

function allCells(table: ReturnType<typeof pathTable>) {
  return table.flat();
}

function leaves(table: ReturnType<typeof pathTable>) {
  return allCells(table).filter((c) => c.kind === "leaf");
}

function groups(table: ReturnType<typeof pathTable>) {
  return allCells(table).filter((c) => c.kind === "group");
}

describe("pathTable", () => {
  test("Should return an empty combined view when all sections are empty", () => {
    const result = pt({}, 0);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual([]);
  });

  test("Should return maxDepth+1 rows regardless of which sections are populated", () => {
    expect(pt({}, 0)).toHaveLength(1);
    expect(pt({ center: [{ id: "a" }] }, 3)).toHaveLength(4);
    expect(pt({}, 2)).toHaveLength(3);
  });

  test("Should include only center cells when start and end are empty", () => {
    const result = pt({ center: [{ id: "a" }, { id: "b" }] }, 0);
    const ls = leaves(result);
    expect(ls).toHaveLength(2);
    expect(ls.map((l) => l.data.id)).toEqual(["a", "b"]);
  });

  test("Should include only start cells when center and end are empty", () => {
    const result = pt({ start: [{ id: "a" }, { id: "b" }] }, 0);
    const ls = leaves(result);
    expect(ls).toHaveLength(2);
    expect(ls.map((l) => l.data.id)).toEqual(["a", "b"]);
  });

  test("Should include only end cells when start and center are empty", () => {
    const result = pt({ end: [{ id: "a" }, { id: "b" }] }, 0);
    const ls = leaves(result);
    expect(ls).toHaveLength(2);
    expect(ls.map((l) => l.data.id)).toEqual(["a", "b"]);
  });

  test("Should place start cells before center cells before end cells within each row", () => {
    const result = pt(
      {
        start: [{ id: "s1" }],
        center: [{ id: "c1" }],
        end: [{ id: "e1" }],
      },
      0,
    );
    expect(result[0].map((c) => c.data.id)).toEqual(["s1", "c1", "e1"]);
  });

  test("Should apply the correct colOffset to center cells", () => {
    const result = pt(
      {
        start: [{ id: "s1" }, { id: "s2" }],
        center: [{ id: "c1" }, { id: "c2" }],
      },
      0,
    );
    const centerLeaves = leaves(result).filter((l) => l.data.id.startsWith("c"));
    expect(centerLeaves[0].colStart).toBe(2);
    expect(centerLeaves[1].colStart).toBe(3);
  });

  test("Should apply the correct colOffset to end cells", () => {
    const result = pt(
      {
        start: [{ id: "s1" }],
        center: [{ id: "c1" }, { id: "c2" }],
        end: [{ id: "e1" }],
      },
      0,
    );
    const endLeaf = leaves(result).find((l) => l.data.id === "e1")!;
    expect(endLeaf.colStart).toBe(3);
  });

  test("Should share seenMap across sections so the same group name in different sections gets unique idOccurrence values", () => {
    const result = pt(
      {
        start: [{ id: "s1", groupPath: ["Sports"] }],
        center: [{ id: "c1", groupPath: ["Sports"] }],
      },
      1,
    );
    const gs = groups(result).filter((g) => g.data.id === "Sports");
    expect(gs).toHaveLength(2);
    expect(gs[0].data.idOccurrence).not.toBe(gs[1].data.idOccurrence);
  });

  test("Should pass lastShouldFill through to each section", () => {
    const result = pt(
      {
        center: [
          { id: "a", groupPath: ["X", "Y"] },
          { id: "b", groupPath: ["X"] },
        ],
      },
      2,
      { lastShouldFill: true },
    );
    const groupX = groups(result).find((g) => g.data.id === "X")!;
    expect(groupX.rowSpan).toBe(2);
    const leafB = leaves(result).find((l) => l.data.id === "b")!;
    expect(leafB.rowStart).toBe(2);
  });

  test("Should pass joinDelimiter through to each section", () => {
    const result = pt({ center: [{ id: "a", groupPath: ["A", "B"] }] }, 2, { joinDelimiter: "|" });
    const gs = groups(result);
    expect(gs.map((g) => g.data.id).sort()).toEqual(["A", "A|B"]);
  });

  test("Should produce correct row count when sections have different group depths and maxDepth is the global maximum", () => {
    // start has depth 1, center has depth 2 — maxDepth=2 normalises both to 3 rows
    const result = pt(
      {
        start: [{ id: "s1", groupPath: ["A"] }],
        center: [{ id: "c1", groupPath: ["X", "Y"] }],
      },
      2,
    );
    expect(result).toHaveLength(3);
    const startLeaf = leaves(result).find((l) => l.data.id === "s1")!;
    expect(startLeaf.rowStart).toBe(1);
    expect(startLeaf.rowSpan).toBe(2);
  });
});

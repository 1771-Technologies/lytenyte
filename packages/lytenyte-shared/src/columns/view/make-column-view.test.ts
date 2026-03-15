import { describe, expect, test } from "vitest";
import { makeColumnView } from "./make-column-view.js";
import { COLUMN_MARKER_ID, GROUP_COLUMN_SINGLE_ID } from "../../+constants.js";

const DEFAULTS = {
  base: {},
  groupExpansions: {},
  groupJoinDelimiter: "/",
  groupExpansionDefault: true,
  filledDepth: false,
  lastGroupShouldFill: false,
  rowGroupDepth: 0,
  rowGroupTemplate: false as const,
  marker: {},
};

function make(overrides: Partial<Parameters<typeof makeColumnView>[0]>) {
  return makeColumnView({ ...DEFAULTS, ...overrides } as Parameters<typeof makeColumnView>[0]);
}

describe("makeColumnView", () => {
  test("Should return a correct view when row group column and marker are both disabled", () => {
    const result = make({ columns: [{ id: "a" }, { id: "b" }] });

    expect(result.visibleColumns.map((c) => c.id)).toEqual(["a", "b"]);
    expect(result.maxRow).toBe(1);
    expect(result.maxCol).toBe(2);
  });

  test("Should include the row group column and marker column in the visible columns when both are enabled", () => {
    const result = make({
      columns: [{ id: "a" }],
      rowGroupDepth: 1,
      rowGroupTemplate: {},
      marker: { on: true },
    });

    const ids = result.visibleColumns.map((c) => c.id);
    expect(ids).toContain(COLUMN_MARKER_ID);
    expect(ids).toContain(GROUP_COLUMN_SINGLE_ID);
    expect(ids).toContain("a");
  });

  test("Should correctly reflect the marker and row group column in the section counts", () => {
    // marker is pinned to start, row group has no pin so goes to center
    const result = make({
      columns: [{ id: "a" }],
      rowGroupDepth: 1,
      rowGroupTemplate: {},
      marker: { on: true },
    });

    expect(result.startCount).toBe(1);
    expect(result.centerCount).toBe(2);
    expect(result.endCount).toBe(0);
  });

  test("Should exclude the marker column from visible columns when it is hidden", () => {
    const result = make({
      columns: [{ id: "a" }],
      marker: { on: true, hide: true },
    });

    expect(result.visibleColumns.map((c) => c.id)).not.toContain(COLUMN_MARKER_ID);
  });

  test("Should exclude the row group column from visible columns when it is hidden", () => {
    const result = make({
      columns: [{ id: "a" }],
      rowGroupDepth: 1,
      rowGroupTemplate: { hide: true },
    });

    expect(result.visibleColumns.map((c) => c.id)).not.toContain(GROUP_COLUMN_SINGLE_ID);
  });

  test("Should produce the correct maxRow when grouped user columns are present alongside both prepended columns", () => {
    const result = make({
      columns: [{ id: "a", groupPath: ["X", "Y"] }],
      rowGroupDepth: 1,
      rowGroupTemplate: {},
      marker: { on: true },
    });

    // maxDepth = 2 from the user column, so maxRow = 3
    expect(result.maxRow).toBe(3);
  });

  test("Should include all user columns plus the prepended columns in the lookup", () => {
    const result = make({
      columns: [{ id: "a" }, { id: "b" }],
      rowGroupDepth: 1,
      rowGroupTemplate: {},
      marker: { on: true },
    });

    expect(result.lookup.has(COLUMN_MARKER_ID)).toBe(true);
    expect(result.lookup.has(GROUP_COLUMN_SINGLE_ID)).toBe(true);
    expect(result.lookup.has("a")).toBe(true);
    expect(result.lookup.has("b")).toBe(true);
  });

  test("Should produce the correct combinedView with both prepended columns and user columns laid out correctly", () => {
    const result = make({
      columns: [{ id: "a", groupPath: ["X"] }],
      rowGroupDepth: 1,
      rowGroupTemplate: {},
      marker: { on: true },
    });

    // row 0: marker leaf (colStart 0), group-col leaf (colStart 1), group "X" cell (colStart 2)
    // row 1: leaf for "a" (colStart 2)
    const row0 = result.combinedView[0];
    const row1 = result.combinedView[1];

    expect(row0.find((c) => c.kind === "leaf" && c.data.id === COLUMN_MARKER_ID)?.colStart).toBe(0);
    expect(row0.find((c) => c.kind === "leaf" && c.data.id === GROUP_COLUMN_SINGLE_ID)?.colStart).toBe(1);
    expect(row0.find((c) => c.kind === "group")).not.toBeNull();

    expect(row1.find((c) => c.kind === "leaf" && c.data.id === "a")?.colStart).toBe(2);
  });
});

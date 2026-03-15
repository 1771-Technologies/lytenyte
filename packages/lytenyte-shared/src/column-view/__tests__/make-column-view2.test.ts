import { describe, expect, test } from "vitest";
import { makeColumnView2, type MakeColumnView2Args } from "../column-view";

const DEFAULTS = {
  base: {},
  groupExpansions: {},
  groupJoinDelimiter: "/",
  groupExpansionDefault: true,
  filledDepth: false,
  lastGroupShouldFill: false,
};

function make(overrides: Partial<MakeColumnView2Args>) {
  return makeColumnView2({ ...DEFAULTS, ...overrides } as MakeColumnView2Args);
}

function findLeaf(view: ReturnType<typeof makeColumnView2>, id: string) {
  for (const row of view.combinedView) {
    for (const cell of row) {
      if (cell.kind === "leaf" && cell.data.id === id) return cell;
    }
  }
  return null;
}

function findGroup(view: ReturnType<typeof makeColumnView2>, groupId: string) {
  for (const row of view.combinedView) {
    for (const cell of row) {
      if (cell.kind === "group" && cell.data.id === groupId) return cell;
    }
  }
  return null;
}

describe("makeColumnView2", () => {
  test("should return all ungrouped columns as leaves in a single row", () => {
    const view = make({ columns: [{ id: "a" }, { id: "b" }, { id: "c" }] });
    expect(view.visibleColumns.map((c) => c.id)).toEqual(["a", "b", "c"]);
    expect(view.maxRow).toBe(1);
    expect(view.maxCol).toBe(3);
    expect(view.combinedView).toHaveLength(1);
    expect(view.combinedView[0].map((c) => c.kind)).toEqual(["leaf", "leaf", "leaf"]);
  });

  test("should assign correct rowStart and colStart to ungrouped leaf cells", () => {
    const view = make({ columns: [{ id: "a" }, { id: "b" }] });
    expect(findLeaf(view, "a")).toMatchObject({ rowStart: 0, colStart: 0, rowSpan: 1, colSpan: 1 });
    expect(findLeaf(view, "b")).toMatchObject({ rowStart: 0, colStart: 1, rowSpan: 1, colSpan: 1 });
  });

  test("should exclude columns with hide:true", () => {
    const view = make({ columns: [{ id: "a" }, { id: "b", hide: true }, { id: "c" }] });
    expect(view.visibleColumns.map((c) => c.id)).toEqual(["a", "c"]);
  });

  test("should exclude columns when base.hide is true and the column has no explicit hide", () => {
    const view = make({
      columns: [{ id: "a" }, { id: "b", hide: false }, { id: "c" }],
      base: { hide: true },
    });
    expect(view.visibleColumns.map((c) => c.id)).toEqual(["b"]);
  });

  test("should treat column hide:false as an override for base.hide:true", () => {
    const view = make({ columns: [{ id: "a", hide: false }], base: { hide: true } });
    expect(view.visibleColumns.map((c) => c.id)).toEqual(["a"]);
  });

  test("should keep hidden columns in the lookup but not in visibleColumns", () => {
    const view = make({ columns: [{ id: "a" }, { id: "b", hide: true }] });
    expect(view.lookup.has("b")).toBe(true);
    expect(view.visibleColumns.find((c) => c.id === "b")).toBeUndefined();
  });

  test("should create a group cell spanning both columns for a shared single-level groupPath", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"] },
        { id: "b", groupPath: ["Sports"] },
      ],
    });
    expect(view.maxRow).toBe(2);
    const group = findGroup(view, "Sports")!;
    expect(group.colSpan).toBe(2);
    expect(group.rowStart).toBe(0);
  });

  test("should produce one group row per depth level for a two-level groupPath", () => {
    const view = make({ columns: [{ id: "a", groupPath: ["Sports", "Football"] }] });
    expect(view.maxRow).toBe(3);
    expect(findGroup(view, "Sports")).not.toBeNull();
    expect(findGroup(view, "Sports/Football")).not.toBeNull();
  });

  test("should fill the leaf upward from where its path ends when lastGroupShouldFill is false", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports", "Football"] },
        { id: "b", groupPath: ["Sports"] },
      ],
      lastGroupShouldFill: false,
    });
    expect(view.maxRow).toBe(3);
    const leafB = findLeaf(view, "b")!;
    expect(leafB.rowStart).toBe(1);
    expect(leafB.rowSpan).toBe(2);
  });

  test("should place the leaf at the bottom row when lastGroupShouldFill is true", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports", "Football"] },
        { id: "b", groupPath: ["Sports"] },
      ],
      lastGroupShouldFill: true,
    });
    expect(view.maxRow).toBe(3);
    expect(findLeaf(view, "b")!.rowStart).toBe(2);
    expect(findLeaf(view, "b")!.rowSpan).toBe(1);
  });

  test("should span ungrouped columns the full height regardless of lastGroupShouldFill", () => {
    const view = make({
      columns: [{ id: "a" }, { id: "b", groupPath: ["Sports"] }],
      lastGroupShouldFill: true,
    });
    const leafA = findLeaf(view, "a")!;
    expect(leafA.rowStart).toBe(0);
    expect(leafA.rowSpan).toBe(2);
  });

  test("should extend the last group rowSpan to fill the gap when lastGroupShouldFill is true", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports", "Football"] },
        { id: "b", groupPath: ["Sports"] },
      ],
      lastGroupShouldFill: true,
    });
    expect(findGroup(view, "Sports")!.rowSpan).toBe(2);
  });

  test("should produce separate group cells for non-adjacent columns with the same groupPath", () => {
    const view = make({
      columns: [{ id: "a", groupPath: ["Sports"] }, { id: "x" }, { id: "b", groupPath: ["Sports"] }],
    });
    const gs = view.combinedView.flat().filter((c) => c.kind === "group" && c.data.id === "Sports");
    expect(gs).toHaveLength(2);
  });

  test("should hide open columns in both non-adjacent groups when their shared expansion id is collapsed", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"], groupVisibility: "always" },
        { id: "a2", groupPath: ["Sports"], groupVisibility: "open" },
        { id: "x" },
        { id: "b", groupPath: ["Sports"], groupVisibility: "always" },
        { id: "b2", groupPath: ["Sports"], groupVisibility: "open" },
      ],
      groupExpansions: { Sports: false },
    });
    const ids = view.visibleColumns.map((c) => c.id);
    expect(ids).toContain("a");
    expect(ids).toContain("b");
    expect(ids).toContain("x");
    expect(ids).not.toContain("a2");
    expect(ids).not.toContain("b2");
  });

  test("should not join groups across pin section boundaries even when the groupPath is the same", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"], pin: "start" },
        { id: "b", groupPath: ["Sports"] },
      ],
    });
    const gs = view.combinedView.flat().filter((c) => c.kind === "group" && c.data.id === "Sports");
    expect(gs).toHaveLength(2);
    expect(gs[0].colSpan).toBe(1);
    expect(gs[1].colSpan).toBe(1);
  });

  test("should join adjacent columns with the same groupPath and pin into one group cell", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"] },
        { id: "b", groupPath: ["Sports"] },
      ],
    });
    const gs = view.combinedView.flat().filter((c) => c.kind === "group");
    expect(gs).toHaveLength(1);
    expect(gs[0].colSpan).toBe(2);
  });

  test("should order visibleColumns as start then center then end", () => {
    const view = make({
      columns: [{ id: "c" }, { id: "s", pin: "start" }, { id: "e", pin: "end" }],
    });
    expect(view.visibleColumns.map((col) => col.id)).toEqual(["s", "c", "e"]);
    expect(view.startCount).toBe(1);
    expect(view.centerCount).toBe(1);
    expect(view.endCount).toBe(1);
  });

  test("should assign colStart values sequentially across pin sections", () => {
    const view = make({
      columns: [{ id: "s", pin: "start" }, { id: "c" }, { id: "e", pin: "end" }],
    });
    expect(findLeaf(view, "s")!.colStart).toBe(0);
    expect(findLeaf(view, "c")!.colStart).toBe(1);
    expect(findLeaf(view, "e")!.colStart).toBe(2);
  });

  test("should mark a group as collapsible when it has both visible-when-collapsed and hidden-when-collapsed columns", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"], groupVisibility: "always" },
        { id: "b", groupPath: ["Sports"], groupVisibility: "open" },
      ],
    });
    expect(view.meta.groupIsCollapsible.get("Sports")).toBe(true);
  });

  test("should not mark a group as collapsible when all columns default to open", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"] },
        { id: "b", groupPath: ["Sports"] },
      ],
    });
    expect(view.meta.groupIsCollapsible.get("Sports")).toBe(false);
  });

  test("should not mark a group as collapsible when no column would be hidden on collapse", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"], groupVisibility: "always" },
        { id: "b", groupPath: ["Sports"], groupVisibility: "close" },
      ],
    });
    expect(view.meta.groupIsCollapsible.get("Sports")).toBe(false);
  });

  test("should mark an ancestor group as collapsible when it has a direct always-visible child and a deeper descendant", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["A"], groupVisibility: "always" },
        { id: "b", groupPath: ["A", "B"] },
      ],
    });
    expect(view.meta.groupIsCollapsible.get("A")).toBe(true);
    expect(view.meta.groupIsCollapsible.get("A/B")).toBe(false);
  });

  test("should mark a group as collapsible when using the close groupVisibility", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"], groupVisibility: "close" },
        { id: "b", groupPath: ["Sports"], groupVisibility: "open" },
      ],
    });
    expect(view.meta.groupIsCollapsible.get("Sports")).toBe(true);
  });

  test("should hide open columns when their direct parent group is collapsed", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"], groupVisibility: "always" },
        { id: "b", groupPath: ["Sports"] },
      ],
      groupExpansions: { Sports: false },
    });
    expect(view.visibleColumns.map((c) => c.id)).toEqual(["a"]);
  });

  test("should show open columns when their direct parent group is expanded", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"], groupVisibility: "always" },
        { id: "b", groupPath: ["Sports"] },
      ],
      groupExpansions: { Sports: true },
      groupExpansionDefault: false,
    });
    expect(view.visibleColumns.map((c) => c.id)).toContain("b");
  });

  test("should show close and always columns and hide open columns when a group is collapsed", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"], groupVisibility: "always" },
        { id: "b", groupPath: ["Sports"], groupVisibility: "close" },
        { id: "c", groupPath: ["Sports"], groupVisibility: "open" },
      ],
      groupExpansions: { Sports: false },
    });
    const ids = view.visibleColumns.map((c) => c.id);
    expect(ids).toContain("a");
    expect(ids).toContain("b");
    expect(ids).not.toContain("c");
  });

  test("should always show an always-visible column regardless of the group collapsed state", () => {
    const view = make({
      columns: [{ id: "a", groupPath: ["Sports"], groupVisibility: "always" }],
      groupExpansions: { Sports: false },
    });
    expect(view.visibleColumns.map((c) => c.id)).toContain("a");
  });

  test("should show columns in a non-collapsible group regardless of its expansion state", () => {
    const view = make({
      columns: [{ id: "a", groupPath: ["Sports"] }],
      groupExpansions: { Sports: false },
    });
    expect(view.visibleColumns.map((c) => c.id)).toContain("a");
  });

  test("should collapse all groups by default when groupExpansionDefault is false", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"], groupVisibility: "always" },
        { id: "b", groupPath: ["Sports"], groupVisibility: "open" },
      ],
      groupExpansions: {},
      groupExpansionDefault: false,
    });
    const ids = view.visibleColumns.map((c) => c.id);
    expect(ids).toContain("a");
    expect(ids).not.toContain("b");
  });

  test("should hide an always-visible column when an ancestor group is collapsed", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["A"], groupVisibility: "always" },
        { id: "b", groupPath: ["A", "B"], groupVisibility: "always" },
        { id: "c", groupPath: ["A", "B"], groupVisibility: "open" },
      ],
      groupExpansions: { A: false },
    });
    const ids = view.visibleColumns.map((c) => c.id);
    expect(ids).toContain("a");
    expect(ids).not.toContain("b");
    expect(ids).not.toContain("c");
  });

  test("should not apply groupVisibility to ancestor groups, only to the direct parent", () => {
    const view = make({
      columns: [
        { id: "keep", groupPath: ["A"], groupVisibility: "always" },
        { id: "drop", groupPath: ["A"], groupVisibility: "open" },
        { id: "b", groupPath: ["A", "B"], groupVisibility: "always" },
        { id: "b2", groupPath: ["A", "B"], groupVisibility: "open" },
      ],
      groupExpansions: { A: false },
    });
    const ids = view.visibleColumns.map((c) => c.id);
    expect(ids).toContain("keep");
    expect(ids).not.toContain("drop");
    expect(ids).not.toContain("b");
    expect(ids).not.toContain("b2");
  });

  test("should apply groupVisibility against the direct parent when an ancestor is expanded", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["A"], groupVisibility: "always" },
        { id: "a2", groupPath: ["A"], groupVisibility: "open" },
        { id: "b", groupPath: ["A", "B"], groupVisibility: "always" },
        { id: "b2", groupPath: ["A", "B"], groupVisibility: "open" },
      ],
      groupExpansions: { A: true, "A/B": false },
    });
    const ids = view.visibleColumns.map((c) => c.id);
    expect(ids).toContain("a");
    expect(ids).toContain("a2");
    expect(ids).toContain("b");
    expect(ids).not.toContain("b2");
  });

  test("should derive maxDepth from visible columns only when filledDepth is false", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"], groupVisibility: "always" },
        { id: "b", groupPath: ["Sports", "Football"], groupVisibility: "open" },
      ],
      groupExpansions: { Sports: false },
      filledDepth: false,
    });
    expect(view.maxRow).toBe(2);
  });

  test("should derive maxDepth from all non-hidden columns when filledDepth is true", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"], groupVisibility: "always" },
        { id: "b", groupPath: ["Sports", "Football"], groupVisibility: "open" },
      ],
      groupExpansions: { Sports: false },
      filledDepth: true,
    });
    expect(view.maxRow).toBe(3);
  });

  test("should produce maxRow of 1 when there are no group paths and filledDepth is false", () => {
    const view = make({ columns: [{ id: "a" }, { id: "b" }], filledDepth: false });
    expect(view.maxRow).toBe(1);
  });

  test("should map column ids to all ancestor group ids in colIdToGroupIds", () => {
    const view = make({ columns: [{ id: "a", groupPath: ["Sports", "Football"] }] });
    expect(view.meta.colIdToGroupIds.get("a")).toEqual(["Sports", "Sports/Football"]);
  });

  test("should include all group ids across all candidates in validGroupIds", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports", "Football"] },
        { id: "b", groupPath: ["News"] },
      ],
    });
    expect(view.meta.validGroupIds.has("Sports")).toBe(true);
    expect(view.meta.validGroupIds.has("Sports/Football")).toBe(true);
    expect(view.meta.validGroupIds.has("News")).toBe(true);
  });

  test("should include group ids from expansion-hidden columns in validGroupIds", () => {
    const view = make({
      columns: [
        { id: "a", groupPath: ["Sports"], groupVisibility: "always" },
        { id: "b", groupPath: ["Sports"], groupVisibility: "open" },
      ],
      groupExpansions: { Sports: false },
    });
    expect(view.meta.validGroupIds.has("Sports")).toBe(true);
  });

  test("should not include ungrouped columns in colIdToGroupIds", () => {
    const view = make({ columns: [{ id: "a" }] });
    expect(view.meta.colIdToGroupIds.has("a")).toBe(false);
  });

  test("should use the groupJoinDelimiter when building group ids", () => {
    const view = make({
      columns: [{ id: "a", groupPath: ["Sports", "Football"] }],
      groupJoinDelimiter: "#",
    });
    expect(view.meta.colIdToGroupIds.get("a")).toEqual(["Sports", "Sports#Football"]);
    expect(view.meta.validGroupIds.has("Sports#Football")).toBe(true);
  });

  test("should count start, center, and end columns correctly", () => {
    const view = make({
      columns: [
        { id: "s1", pin: "start" },
        { id: "s2", pin: "start" },
        { id: "c1" },
        { id: "e1", pin: "end" },
      ],
    });
    expect(view.startCount).toBe(2);
    expect(view.centerCount).toBe(1);
    expect(view.endCount).toBe(1);
  });

  test("should include all input columns in the lookup including hidden ones", () => {
    const view = make({ columns: [{ id: "a" }, { id: "b", hide: true }] });
    expect(view.lookup.has("a")).toBe(true);
    expect(view.lookup.has("b")).toBe(true);
  });

  test("should set maxCol equal to the number of visible columns", () => {
    const view = make({ columns: [{ id: "a" }, { id: "b", hide: true }, { id: "c" }] });
    expect(view.maxCol).toBe(2);
    expect(view.visibleColumns).toHaveLength(2);
  });

  test("should return an empty view when the columns array is empty", () => {
    const view = make({ columns: [] });
    expect(view.visibleColumns).toHaveLength(0);
    expect(view.maxRow).toBe(1);
    expect(view.maxCol).toBe(0);
    expect(view.combinedView).toHaveLength(1);
    expect(view.combinedView[0]).toHaveLength(0);
  });

  test("should return an empty view when all columns are hidden", () => {
    const view = make({ columns: [{ id: "a", hide: true }] });
    expect(view.visibleColumns).toHaveLength(0);
    expect(view.maxCol).toBe(0);
  });

  test("should produce the correct group hierarchy for a single column with a deep groupPath", () => {
    const view = make({ columns: [{ id: "a", groupPath: ["A", "B", "C"] }] });
    expect(view.maxRow).toBe(4);
    expect(findGroup(view, "A")).not.toBeNull();
    expect(findGroup(view, "A/B")).not.toBeNull();
    expect(findGroup(view, "A/B/C")).not.toBeNull();
    expect(findLeaf(view, "a")!.rowStart).toBe(3);
  });

  test("should separate same-named groups across pin sections and join them within a section", () => {
    const view = make({
      columns: [
        { id: "s", pin: "start", groupPath: ["Tools"] },
        { id: "a", groupPath: ["Sports"] },
        { id: "b", groupPath: ["Sports"] },
        { id: "e", pin: "end", groupPath: ["Tools"] },
      ],
    });
    const toolsGroups = view.combinedView.flat().filter((c) => c.kind === "group" && c.data.id === "Tools");
    const sportsGroups = view.combinedView.flat().filter((c) => c.kind === "group" && c.data.id === "Sports");
    expect(toolsGroups).toHaveLength(2);
    expect(sportsGroups).toHaveLength(1);
    expect(sportsGroups[0].colSpan).toBe(2);
  });

  test("should produce a combinedView with exactly maxRow rows", () => {
    const view = make({ columns: [{ id: "a", groupPath: ["A", "B", "C"] }, { id: "b" }] });
    expect(view.combinedView).toHaveLength(view.maxRow);
  });
});

import { describe, expect, test } from "vitest";
import { columnGroupMeta } from "./column-group-meta.js";

describe("columnGroupMeta", () => {
  test("Should return empty structures when candidates is an empty array", () => {
    const result = columnGroupMeta([], ">");

    expect(result.colIdToGroupIds.size).toBe(0);
    expect(result.validGroupIds.size).toBe(0);
    expect(result.groupIsCollapsible.size).toBe(0);
  });

  test("Should ignore columns with no groupPath", () => {
    const result = columnGroupMeta([{ id: "col1" }], ">");

    expect(result.colIdToGroupIds.size).toBe(0);
    expect(result.validGroupIds.size).toBe(0);
    expect(result.groupIsCollapsible.size).toBe(0);
  });

  test("Should ignore columns with an empty groupPath array", () => {
    const result = columnGroupMeta([{ id: "col1", groupPath: [] }], ">");

    expect(result.colIdToGroupIds.size).toBe(0);
    expect(result.validGroupIds.size).toBe(0);
    expect(result.groupIsCollapsible.size).toBe(0);
  });

  test("Should map a column id to all its ancestor group IDs in colIdToGroupIds", () => {
    const result = columnGroupMeta([{ id: "col1", groupPath: ["A", "B", "C"] }], ">");

    expect(result.colIdToGroupIds.get("col1")).toEqual(["A", "A>B", "A>B>C"]);
  });

  test("Should add all intermediate group IDs to validGroupIds for a multi-level groupPath", () => {
    const result = columnGroupMeta([{ id: "col1", groupPath: ["A", "B", "C"] }], ">");

    expect(result.validGroupIds).toContain("A");
    expect(result.validGroupIds).toContain("A>B");
    expect(result.validGroupIds).toContain("A>B>C");
    expect(result.validGroupIds.size).toBe(3);
  });

  test("Should use the groupJoinDelimiter when building group IDs for multi-level paths", () => {
    const result = columnGroupMeta([{ id: "col1", groupPath: ["A", "B", "C"] }], "|");

    expect(result.colIdToGroupIds.get("col1")).toEqual(["A", "A|B", "A|B|C"]);
    expect(result.validGroupIds).toContain("A|B|C");
  });

  test("Should mark a group as not collapsible when all direct children have groupVisibility 'open'", () => {
    const result = columnGroupMeta(
      [
        { id: "col1", groupPath: ["A"], groupVisibility: "open" },
        { id: "col2", groupPath: ["A"], groupVisibility: "open" },
      ],
      ">",
    );

    expect(result.groupIsCollapsible.get("A")).toBe(false);
  });

  test("Should mark a group as not collapsible when all direct children have groupVisibility 'close'", () => {
    const result = columnGroupMeta(
      [
        { id: "col1", groupPath: ["A"], groupVisibility: "close" },
        { id: "col2", groupPath: ["A"], groupVisibility: "close" },
      ],
      ">",
    );

    expect(result.groupIsCollapsible.get("A")).toBe(false);
  });

  test("Should mark a group as collapsible when it has both 'open' and 'close' direct children", () => {
    const result = columnGroupMeta(
      [
        { id: "col1", groupPath: ["A"], groupVisibility: "open" },
        { id: "col2", groupPath: ["A"], groupVisibility: "close" },
      ],
      ">",
    );

    expect(result.groupIsCollapsible.get("A")).toBe(true);
  });

  test("Should treat a missing groupVisibility as 'open'", () => {
    const result = columnGroupMeta(
      [
        { id: "col1", groupPath: ["A"] },
        { id: "col2", groupPath: ["A"], groupVisibility: "close" },
      ],
      ">",
    );

    // col1 has no groupVisibility, treated as "open" — so the group has both open and close children
    expect(result.groupIsCollapsible.get("A")).toBe(true);
  });

  test("Should count a deeper descendant as a hidden child for all ancestor groups", () => {
    // col1 is a deeper descendant of "A", so it contributes close:true to "A"
    // col2 is a direct child of "A" with groupVisibility "close", contributing open:true to "A"
    // Together they make "A" collapsible
    const result = columnGroupMeta(
      [
        { id: "col1", groupPath: ["A", "B"] },
        { id: "col2", groupPath: ["A"], groupVisibility: "close" },
      ],
      ">",
    );

    expect(result.groupIsCollapsible.get("A")).toBe(true);
  });

  test("Should create a colIdToGroupIds entry for each column in the same group", () => {
    const result = columnGroupMeta(
      [
        { id: "col1", groupPath: ["A"] },
        { id: "col2", groupPath: ["A"] },
      ],
      ">",
    );

    expect(result.colIdToGroupIds.get("col1")).toEqual(["A"]);
    expect(result.colIdToGroupIds.get("col2")).toEqual(["A"]);
  });

  test("Should compute collapsibility of a parent group independently from its child group", () => {
    // "A" is collapsible: has a direct child with "close" (col2) and a direct child with "open" (col3)
    // "A>B" is not collapsible: all its direct children have groupVisibility "close"
    const result = columnGroupMeta(
      [
        { id: "col1", groupPath: ["A", "B"], groupVisibility: "close" },
        { id: "col2", groupPath: ["A"], groupVisibility: "close" },
        { id: "col3", groupPath: ["A"], groupVisibility: "open" },
        { id: "col4", groupPath: ["A", "B"], groupVisibility: "close" },
      ],
      ">",
    );

    expect(result.groupIsCollapsible.get("A")).toBe(true);
    expect(result.groupIsCollapsible.get("A>B")).toBe(false);
  });

  test("Should mark a group as collapsible when it has one always-visible direct child and several non-direct children", () => {
    // col1 is the single direct child with groupVisibility "close" (always visible) → open: true
    // col2, col3, col4 are non-direct children (deeper descendants) → close: true for "A"
    // Together they make "A" collapsible
    const result = columnGroupMeta(
      [
        { id: "col1", groupPath: ["A"], groupVisibility: "close" },
        { id: "col2", groupPath: ["A", "B"] },
        { id: "col3", groupPath: ["A", "B"] },
        { id: "col4", groupPath: ["A", "C"] },
      ],
      ">",
    );

    expect(result.groupIsCollapsible.get("A")).toBe(true);
  });

  test("Should produce independent entries for columns belonging to completely separate groups", () => {
    const result = columnGroupMeta(
      [
        { id: "col1", groupPath: ["X"] },
        { id: "col2", groupPath: ["Y"] },
      ],
      ">",
    );

    expect(result.colIdToGroupIds.get("col1")).toEqual(["X"]);
    expect(result.colIdToGroupIds.get("col2")).toEqual(["Y"]);
    expect(result.validGroupIds).toContain("X");
    expect(result.validGroupIds).toContain("Y");
    expect(result.validGroupIds.size).toBe(2);
  });
});

import { describe, expect, test } from "vitest";
import { columnGroupMeta } from "../group-meta/column-group-meta.js";
import { visibleColumnsByGroup } from "./visible-columns-by-group.js";

describe("visibleColumnsByGroup", () => {
  test("Should return all columns when candidates is empty", () => {
    const meta = columnGroupMeta([], ">");
    const result = visibleColumnsByGroup([], {}, false, meta);

    expect(result).toEqual([]);
  });

  test("Should include columns with no groupPath regardless of group state", () => {
    const col = { id: "col1" };
    const meta = columnGroupMeta([], ">");
    const result = visibleColumnsByGroup([col], {}, false, meta);

    expect(result).toEqual([col]);
  });

  test("Should include all columns when no groups are collapsible", () => {
    const col1 = { id: "col1", groupPath: ["A"], groupVisibility: "open" as const };
    const col2 = { id: "col2", groupPath: ["A"], groupVisibility: "open" as const };
    const meta = columnGroupMeta([col1, col2], ">");

    // "A" is not collapsible — all children have the same visibility
    const result = visibleColumnsByGroup([col1, col2], { A: false }, false, meta);

    expect(result).toEqual([col1, col2]);
  });

  test("Should include all columns when all collapsible groups are expanded", () => {
    const col1 = { id: "col1", groupPath: ["A"], groupVisibility: "open" as const };
    const col2 = { id: "col2", groupPath: ["A"], groupVisibility: "close" as const };
    const meta = columnGroupMeta([col1, col2], ">");

    const result = visibleColumnsByGroup([col1, col2], { A: true }, false, meta);

    expect(result).toEqual([col1, col2]);
  });

  test("Should exclude a column with groupVisibility 'open' when its direct parent group is collapsed", () => {
    const col1 = { id: "col1", groupPath: ["A"], groupVisibility: "open" as const };
    const col2 = { id: "col2", groupPath: ["A"], groupVisibility: "close" as const };
    const meta = columnGroupMeta([col1, col2], ">");

    const result = visibleColumnsByGroup([col1, col2], { A: false }, false, meta);

    expect(result).toEqual([col2]);
  });

  test("Should include a column with groupVisibility 'close' when its direct parent group is collapsed", () => {
    const col1 = { id: "col1", groupPath: ["A"], groupVisibility: "close" as const };
    const col2 = { id: "col2", groupPath: ["A"], groupVisibility: "open" as const };
    const meta = columnGroupMeta([col1, col2], ">");

    const result = visibleColumnsByGroup([col1], { A: false }, false, meta);

    expect(result).toEqual([col1]);
  });

  test("Should treat missing groupVisibility as 'open' when the direct parent group is collapsed", () => {
    const col1 = { id: "col1", groupPath: ["A"] };
    const col2 = { id: "col2", groupPath: ["A"], groupVisibility: "close" as const };
    const meta = columnGroupMeta([col1, col2], ">");

    // col1 has no groupVisibility, treated as "open" → excluded when parent is collapsed
    const result = visibleColumnsByGroup([col1], { A: false }, false, meta);

    expect(result).toEqual([]);
  });

  test("Should exclude a column when a collapsed group is an ancestor and not the direct parent", () => {
    // "sticky" is a direct child of "A" with vis "close" → makes "A" collapsible
    // col1 is a deeper descendant of "A" → excluded when "A" is collapsed
    const sticky = { id: "sticky", groupPath: ["A"], groupVisibility: "close" as const };
    const col1 = { id: "col1", groupPath: ["A", "B"] };
    const meta = columnGroupMeta([sticky, col1], ">");

    const result = visibleColumnsByGroup([col1], { A: false }, false, meta);

    expect(result).toEqual([]);
  });

  test("Should use groupExpansionDefault when a group has no entry in groupExpansions", () => {
    const col1 = { id: "col1", groupPath: ["A"], groupVisibility: "open" as const };
    const col2 = { id: "col2", groupPath: ["A"], groupVisibility: "close" as const };
    const meta = columnGroupMeta([col1, col2], ">");

    // No entry for "A" in groupExpansions — falls back to default=false (collapsed)
    const result = visibleColumnsByGroup([col1, col2], {}, false, meta);

    expect(result).toEqual([col2]);
  });

  test("Should use groupExpansions over groupExpansionDefault when an entry exists", () => {
    const col1 = { id: "col1", groupPath: ["A"], groupVisibility: "open" as const };
    const col2 = { id: "col2", groupPath: ["A"], groupVisibility: "close" as const };
    const meta = columnGroupMeta([col1, col2], ">");

    // default=false (collapsed), but explicit entry says expanded → both columns visible
    const result = visibleColumnsByGroup([col1, col2], { A: true }, false, meta);

    expect(result).toEqual([col1, col2]);
  });

  test("Should stop evaluating further ancestor groups once a collapsed ancestor excludes a column", () => {
    // col1 has groupVisibility "close" — it would survive a collapsed "A>B" direct parent
    // but "A" is a collapsed ancestor, which excludes it before "A>B" is ever evaluated
    const stickyA = { id: "stickyA", groupPath: ["A"], groupVisibility: "close" as const };
    const col1 = { id: "col1", groupPath: ["A", "B"], groupVisibility: "close" as const };
    const normalB = { id: "normalB", groupPath: ["A", "B"], groupVisibility: "open" as const };
    const meta = columnGroupMeta([stickyA, col1, normalB], ">");

    // "A" collapsed → col1 excluded by ancestor, even though its direct parent "A>B" would keep it visible
    const result = visibleColumnsByGroup([col1], { A: false, "A>B": false }, false, meta);

    expect(result).toEqual([]);
  });

  test("Should skip non-collapsible groups when determining visibility", () => {
    const col1 = { id: "col1", groupPath: ["A"], groupVisibility: "open" as const };
    const col2 = { id: "col2", groupPath: ["A"], groupVisibility: "open" as const };
    const meta = columnGroupMeta([col1, col2], ">");

    // "A" is not collapsible — groupExpansions entry is ignored
    const result = visibleColumnsByGroup([col1, col2], { A: false }, false, meta);

    expect(result).toEqual([col1, col2]);
  });

  test("Should handle a column nested under multiple levels of collapsible groups correctly", () => {
    const stickyA = { id: "stickyA", groupPath: ["A"], groupVisibility: "close" as const };
    const col1 = { id: "col1", groupPath: ["A", "B"], groupVisibility: "open" as const };
    const stickyB = { id: "stickyB", groupPath: ["A", "B"], groupVisibility: "close" as const };
    const meta = columnGroupMeta([stickyA, col1, stickyB], ">");

    // "A" expanded, "A>B" collapsed → col1 has vis "open" for direct parent "A>B" → excluded
    const collapsed = visibleColumnsByGroup([col1], { A: true, "A>B": false }, false, meta);
    expect(collapsed).toEqual([]);

    // Both expanded → col1 included
    const expanded = visibleColumnsByGroup([col1], { A: true, "A>B": true }, false, meta);
    expect(expanded).toEqual([col1]);
  });
});

import { describe, expect, test } from "vitest";
import type { RowSelectionState } from "../types.js";
import { rowSelectLinkWithParents } from "./row-select-link-with-parents.js";
import { rowSelectLinkWithoutParents } from "./row-select-link-without-parent.js";

describe("rowSelectLinkWithoutParents", () => {
  test("Should return the row selection without parent links", () => {
    const state: RowSelectionState = {
      kind: "linked",
      selected: false,
      children: new Map([["Alpha", { id: "x", children: new Map([["#", { id: "c", selected: false }]]) }]]),
    };
    const result = rowSelectLinkWithoutParents(rowSelectLinkWithParents(state));
    expect(result).toEqual(state);
  });
});

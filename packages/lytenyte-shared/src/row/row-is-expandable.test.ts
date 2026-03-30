import { describe, expect, test } from "vitest";
import { rowIsExpandable } from "./row-is-expandable.js";

describe("rowIsExpandable", () => {
  test("Should return the correct result", () => {
    expect(rowIsExpandable({ kind: "branch", expandable: false } as any)).toEqual(false);
    expect(rowIsExpandable({ kind: "branch", expandable: true } as any)).toEqual(true);
    expect(rowIsExpandable({ kind: "leaf", expanded: true } as any)).toEqual(false);
  });
});

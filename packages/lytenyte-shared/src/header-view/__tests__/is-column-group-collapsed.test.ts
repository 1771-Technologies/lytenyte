import { describe, expect, test } from "vitest";
import { isColumnGroupCollapsed } from "../is-column-group-collapsed.js";

describe("isColumnGroupCollapsed", () => {
  test("should return the correct result", () => {
    expect(isColumnGroupCollapsed(["A"], {}, true, new Map([["A", true]]))).toEqual(false);
    expect(isColumnGroupCollapsed(["A"], {}, false, new Map([["A", true]]))).toEqual(true);
    expect(isColumnGroupCollapsed(["A"], { A: true }, false, new Map([["A", true]]))).toEqual(false);
    expect(isColumnGroupCollapsed(["A"], { A: false }, true, new Map([["A", true]]))).toEqual(true);
    expect(isColumnGroupCollapsed(["A"], { A: false }, true, new Map([["A", false]]))).toEqual(false);
  });
});

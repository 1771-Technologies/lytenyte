import { describe, expect, test } from "vitest";
import { groupEvaluator } from "../evaluator-group";
import type { GroupItem } from "../+types";

describe("groupEvaluator", () => {
  const data = { a: "two", b: "alpha", c: "three" };
  test("should correctly calculate group path", () => {
    const groups: GroupItem<typeof data>[] = [{ fn: (c) => c.a }, { fn: (c) => c.b }];

    const d = groupEvaluator(groups, data);
    expect(d).toMatchInlineSnapshot(`
      [
        "two",
        "alpha",
      ]
    `);
  });

  test("should correctly handle empty groups", () => {
    expect(groupEvaluator([], data)).toMatchInlineSnapshot(`[]`);
  });
});

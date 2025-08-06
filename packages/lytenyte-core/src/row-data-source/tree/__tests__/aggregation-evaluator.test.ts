import { describe, test, expect } from "vitest";
import { aggregationEvaluator } from "../evaluator-aggregation";

const sum = (d: number[]) => d.reduce((a, b) => a + b);
const avg = (d: number[]) => sum(d) / d.length;

describe("aggregationEvaluator", () => {
  test("should return the correct result", () => {
    let res = aggregationEvaluator([{ fn: () => 2, name: "x" }], [1, 2, 3]);
    expect(res).toMatchInlineSnapshot(`
      {
        "x": 2,
      }
    `);

    res = aggregationEvaluator(
      [
        { fn: sum, name: "x" },
        { fn: avg, name: "y" },
      ],
      [1, 2, 3],
    );

    expect(res).toMatchInlineSnapshot(`
      {
        "x": 6,
        "y": 2,
      }
    `);
  });

  test("should handle empty aggregation arrays", () => {
    const res = aggregationEvaluator([], [1, 2, 3]);
    expect(res).toMatchInlineSnapshot(`{}`);
  });

  test("latter keys should override previous keys", () => {
    const res = aggregationEvaluator(
      [
        { fn: sum, name: "x" },
        { fn: avg, name: "y" },
        { fn: sum, name: "y" },
      ],
      [1, 2, 3],
    );

    expect(res).toMatchInlineSnapshot(`
      {
        "x": 6,
        "y": 6,
      }
    `);
  });
});

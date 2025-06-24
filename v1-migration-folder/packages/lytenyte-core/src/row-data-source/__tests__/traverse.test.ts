import { describe, expect, test } from "vitest";
import { makeClientTree } from "../client-tree";
import { bankDataSmall as d } from "@1771technologies/sample-data/bank-data-smaller";
import { traverse } from "../traverse";

describe("traverse", () => {
  test("should traverse every node", () => {
    const tree = makeClientTree({
      rowData: d.slice(0, 15),
      rowAggModel: [{ name: "age", fn: (d) => d.reduce((acc, r) => acc + r.age, 0) }],
      rowBranchModel: [{ fn: (c) => c.job }, { fn: (c) => c.default }],
    });

    const path: string[] = [];
    traverse(tree.root, (n) => {
      path.push(n.id);
    });

    expect(path).toMatchInlineSnapshot(`
      [
        "unemployed",
        "unemployed/no",
        "0",
        "services",
        "services/no",
        "1",
        "9",
        "10",
        "management",
        "management/no",
        "2",
        "3",
        "5",
        "blue-collar",
        "blue-collar/no",
        "4",
        "14",
        "self-employed",
        "self-employed/no",
        "6",
        "technician",
        "technician/no",
        "7",
        "12",
        "entrepreneur",
        "entrepreneur/no",
        "8",
        "admin.",
        "admin./no",
        "11",
        "student",
        "student/no",
        "13",
      ]
    `);
  });
  test("should traverse with the ability to stop a specific branches", () => {
    const tree = makeClientTree({
      rowData: d.slice(0, 15),
      rowAggModel: [{ name: "age", fn: (d) => d.reduce((acc, r) => acc + r.age, 0) }],
      rowBranchModel: [{ fn: (c) => c.job }, { fn: (c) => c.default }],
    });

    const path: string[] = [];
    traverse(tree.root, (n) => {
      if (n.id === "management" || n.id === "self-employed") return false;
      path.push(n.id);
    });
    expect(path).toMatchInlineSnapshot(`
      [
        "unemployed",
        "unemployed/no",
        "0",
        "services",
        "services/no",
        "1",
        "9",
        "10",
        "blue-collar",
        "blue-collar/no",
        "4",
        "14",
        "technician",
        "technician/no",
        "7",
        "12",
        "entrepreneur",
        "entrepreneur/no",
        "8",
        "admin.",
        "admin./no",
        "11",
        "student",
        "student/no",
        "13",
      ]
    `);
  });

  test("should be able to provide a support comparator", () => {
    const tree = makeClientTree({
      rowData: d.slice(0, 15),
      rowAggModel: [{ name: "age", fn: (d) => d.reduce((acc, r) => acc + r.age, 0) }],
      rowBranchModel: [{ fn: (c) => c.job }, { fn: (c) => c.default }],
    });

    const path: string[] = [];
    traverse(
      tree.root,
      (n) => {
        if (n.id === "management" || n.id === "self-employed") return false;
        path.push(n.id);
      },
      (l, r) => {
        return l.id.localeCompare(r.id);
      },
    );
    expect(path).toMatchInlineSnapshot(`
      [
        "admin.",
        "admin./no",
        "11",
        "blue-collar",
        "blue-collar/no",
        "14",
        "4",
        "entrepreneur",
        "entrepreneur/no",
        "8",
        "services",
        "services/no",
        "1",
        "10",
        "9",
        "student",
        "student/no",
        "13",
        "technician",
        "technician/no",
        "12",
        "7",
        "unemployed",
        "unemployed/no",
        "0",
      ]
    `);
  });
});

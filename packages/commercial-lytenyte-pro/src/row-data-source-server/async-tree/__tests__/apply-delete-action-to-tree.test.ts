import { describe, expect, test } from "vitest";
import type { TreeRoot } from "../+types.async-tree";
import { applySetActionToTree } from "../apply-set-action-to-tree";
import { printTreeByIndex } from "./print-tree";
import { applyDeleteActionToTree } from "../apply-delete-action-to-tree";

describe("applyDeleteActionToTree", () => {
  test("should correctly delete tree parts", () => {
    const root: TreeRoot<any, any> = {
      byIndex: new Map(),
      byPath: new Map(),
      kind: "root",
      size: 10,
    };

    applySetActionToTree(
      {
        path: [],
        items: [
          { kind: "parent", data: 11, relIndex: 2, path: "A", size: 10 },
          { kind: "parent", data: 11, relIndex: 3, path: "B", size: 10 },
          { kind: "parent", data: 11, relIndex: 4, path: "C", size: 10 },
          { kind: "leaf", data: 1, relIndex: 5 },
          { kind: "leaf", data: 1, relIndex: 6 },
        ],
      },
      root
    );

    applySetActionToTree(
      {
        path: ["A"],
        items: [
          { kind: "leaf", data: "l", relIndex: 0 },
          { kind: "leaf", data: "a", relIndex: 3 },
          { kind: "leaf", data: "l", relIndex: 4 },
          { kind: "parent", data: 11, relIndex: 5, path: "AA", size: 10 },
        ],
      },
      root
    );

    expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
      "
      #
      ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
         ├─ 0 / L / A#0 / 2 / DATA: "l"
         ├─ 3 / L / A#3 / 2 / DATA: "a"
         ├─ 4 / L / A#4 / 2 / DATA: "l"
         ├─ 5 / P / AA / 2 / SIZE: 10 / DATA: 11
      ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
      ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
      ├─ 5 / L / $#5 / $ / DATA: 1
      ├─ 6 / L / $#6 / $ / DATA: 1"
    `);

    applyDeleteActionToTree(
      {
        relIndices: [5, 6],
        path: [],
      },
      root
    );
    expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
      "
      #
      ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
         ├─ 0 / L / A#0 / 2 / DATA: "l"
         ├─ 3 / L / A#3 / 2 / DATA: "a"
         ├─ 4 / L / A#4 / 2 / DATA: "l"
         ├─ 5 / P / AA / 2 / SIZE: 10 / DATA: 11
      ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
      ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11"
    `);

    applyDeleteActionToTree(
      {
        paths: ["A"],
        path: [],
      },
      root
    );

    expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
      "
      #
      ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
      ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11"
    `);
  });

  test("should handle nested deletions", () => {
    const root: TreeRoot<any, any> = {
      byIndex: new Map(),
      byPath: new Map(),
      kind: "root",
      size: 10,
    };

    applySetActionToTree(
      {
        path: [],
        items: [
          { kind: "parent", data: 11, relIndex: 2, path: "A", size: 10 },
          { kind: "parent", data: 11, relIndex: 3, path: "B", size: 10 },
          { kind: "parent", data: 11, relIndex: 4, path: "C", size: 10 },
          { kind: "leaf", data: 1, relIndex: 5 },
          { kind: "leaf", data: 1, relIndex: 6 },
        ],
      },
      root
    );

    applySetActionToTree(
      {
        path: ["A"],
        items: [
          { kind: "leaf", data: "l", relIndex: 0 },
          { kind: "leaf", data: "a", relIndex: 3 },
          { kind: "leaf", data: "l", relIndex: 4 },
          { kind: "parent", data: 11, relIndex: 5, path: "AA", size: 10 },
        ],
      },
      root
    );

    expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
      "
      #
      ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
         ├─ 0 / L / A#0 / 2 / DATA: "l"
         ├─ 3 / L / A#3 / 2 / DATA: "a"
         ├─ 4 / L / A#4 / 2 / DATA: "l"
         ├─ 5 / P / AA / 2 / SIZE: 10 / DATA: 11
      ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
      ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
      ├─ 5 / L / $#5 / $ / DATA: 1
      ├─ 6 / L / $#6 / $ / DATA: 1"
    `);

    applyDeleteActionToTree(
      {
        relIndices: [5, 6],
        path: ["A"],
      },
      root
    );

    expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
      "
      #
      ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
         ├─ 0 / L / A#0 / 2 / DATA: "l"
         ├─ 3 / L / A#3 / 2 / DATA: "a"
         ├─ 4 / L / A#4 / 2 / DATA: "l"
      ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
      ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
      ├─ 5 / L / $#5 / $ / DATA: 1
      ├─ 6 / L / $#6 / $ / DATA: 1"
    `);
  });

  test("should no-op on invalid inputs", () => {
    const root: TreeRoot<any, any> = {
      byIndex: new Map(),
      byPath: new Map(),
      kind: "root",
      size: 10,
    };

    applySetActionToTree(
      {
        path: [],
        items: [
          { kind: "parent", data: 11, relIndex: 2, path: "A", size: 10 },
          { kind: "parent", data: 11, relIndex: 3, path: "B", size: 10 },
          { kind: "parent", data: 11, relIndex: 4, path: "C", size: 10 },
          { kind: "leaf", data: 1, relIndex: 5 },
          { kind: "leaf", data: 1, relIndex: 6 },
        ],
      },
      root
    );

    applySetActionToTree(
      {
        path: ["A"],
        items: [
          { kind: "leaf", data: "l", relIndex: 0 },
          { kind: "leaf", data: "a", relIndex: 3 },
          { kind: "leaf", data: "l", relIndex: 4 },
          { kind: "parent", data: 11, relIndex: 5, path: "AA", size: 10 },
        ],
      },
      root
    );

    applyDeleteActionToTree({ path: [] }, root);
    applyDeleteActionToTree({ path: ["X"], relIndices: [1, 2] }, root);
    applyDeleteActionToTree({ path: [], paths: ["X"] }, root);

    expect(printTreeByIndex(root)).toMatchInlineSnapshot(`
      "
      #
      ├─ 2 / P / A / $ / SIZE: 10 / DATA: 11
         ├─ 0 / L / A#0 / 2 / DATA: "l"
         ├─ 3 / L / A#3 / 2 / DATA: "a"
         ├─ 4 / L / A#4 / 2 / DATA: "l"
         ├─ 5 / P / AA / 2 / SIZE: 10 / DATA: 11
      ├─ 3 / P / B / $ / SIZE: 10 / DATA: 11
      ├─ 4 / P / C / $ / SIZE: 10 / DATA: 11
      ├─ 5 / L / $#5 / $ / DATA: 1
      ├─ 6 / L / $#6 / $ / DATA: 1"
    `);
  });
});

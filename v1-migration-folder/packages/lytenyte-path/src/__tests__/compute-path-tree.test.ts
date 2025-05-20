/*
Copyright 2025 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { PathRoot, PathBranch, PathLeaf } from "../_types.path-table.js";
import { computePathTree } from "../compute-path-tree.js";
import { expect, test } from "vitest";

test("computePathTree: should create the correct basic tree", () => {
  const paths = [
    { id: "x", groupPath: ["A", "B"] },
    { id: "y" },
    { id: "z", groupPath: ["A", "B", "C"] },
    { id: "d", groupPath: ["Y", "X", "C"] },
    { id: "v", groupPath: ["F"] },
  ];

  const tree = computePathTree(paths);

  expect(printPathTree(tree)).toMatchInlineSnapshot(`
    "
    root
    ├─ A / root / branch
    │  └─ A#B / A / branch
    │    └─ x / A#B / leaf
    │    └─ A#B#C / A#B / branch
    │      └─ z / A#B#C / leaf
    ├─ y / root / leaf
    ├─ Y / root / branch
    │  └─ Y#X / Y / branch
    │    └─ Y#X#C / Y#X / branch
    │      └─ d / Y#X#C / leaf
    └─ F / root / branch
       └─ v / F / leaf"
  `);
});

test("computePathTree: should handle adjacent paths of varying levels", () => {
  const paths = [
    { id: "x", groupPath: ["A", "B"] },
    { id: "t", groupPath: ["A", "B", "C"] },
    { id: "b", groupPath: ["A", "B"] },
    { id: "y" },
    { id: "z", groupPath: ["A", "B", "C"] },
    { id: "d", groupPath: ["Y", "X", "C"] },
    { id: "v", groupPath: ["F"] },
  ];

  const tree = computePathTree(paths);

  expect(printPathTree(tree)).toMatchInlineSnapshot(`
    "
    root
    ├─ A / root / branch
    │  └─ A#B / A / branch
    │    └─ x / A#B / leaf
    │    └─ A#B#C / A#B / branch
    │      └─ t / A#B#C / leaf
    │      └─ z / A#B#C / leaf
    │    └─ b / A#B / leaf
    ├─ y / root / leaf
    ├─ Y / root / branch
    │  └─ Y#X / Y / branch
    │    └─ Y#X#C / Y#X / branch
    │      └─ d / Y#X#C / leaf
    └─ F / root / branch
       └─ v / F / leaf"
  `);
});

test("computePathTree: should handle a completely flat tree", () => {
  const paths = [{ id: "x" }, { id: "t" }, { id: "b" }, { id: "y" }];

  const tree = computePathTree(paths);
  expect(printPathTree(tree)).toMatchInlineSnapshot(`
    "
    root
    ├─ x / root / leaf
    ├─ t / root / leaf
    ├─ b / root / leaf
    └─ y / root / leaf"
  `);
});

test("computePathTree: should handle non-distinct paths", () => {
  const paths = [
    { id: "x", groupPath: ["A", "B"] },
    { id: "t", groupPath: ["A", "B", "C"] },
    { id: "b", groupPath: ["A", "B"] },
    { id: "y" },
    { id: "z", groupPath: ["A", "B", "C"] },
    { id: "d", groupPath: ["Y", "X", "C"] },
    { id: "v", groupPath: ["F"] },
  ];

  const tree = computePathTree(paths, {}, true);

  expect(printPathTree(tree)).toMatchInlineSnapshot(`
    "
    root
    ├─ A / root / branch
    │  └─ A#B / A / branch
    │    └─ x / A#B / leaf
    │    └─ A#B#C / A#B / branch
    │      └─ t / A#B#C / leaf
    │    └─ b / A#B / leaf
    ├─ y / root / leaf
    ├─ A / root / branch
    │  └─ A#B / A / branch
    │    └─ A#B#C / A#B / branch
    │      └─ z / A#B#C / leaf
    ├─ Y / root / branch
    │  └─ Y#X / Y / branch
    │    └─ Y#X#C / Y#X / branch
    │      └─ d / Y#X#C / leaf
    └─ F / root / branch
       └─ v / F / leaf"
  `);
});

// TEST HELPERS
function printPathTree(tree: PathRoot) {
  const rows: string[] = ["root"];

  const stack = [...tree.children.values()].map(
    (c, i) => [c, 0, i === tree.children.size - 1] as [PathBranch | PathLeaf, number, boolean],
  );

  while (stack.length) {
    const [item, depth, isLast] = stack.shift()!;

    const row: string[] = [];
    if (depth === 0) {
      row.push(stack.length ? "├─ " : "└─ ");
    } else if (!isLast) {
      row.push("│");
    } else {
      row.push(" ");
    }
    const indent = depth === 0 ? "" : " ".repeat(depth * 2);
    row.push(indent);

    if (depth !== 0) {
      row.push("└─ ");
    }

    const id = item.data.id;
    const parentId = item.parent.kind === "root" ? "root" : item.parent.data.id;

    row.push(`${id} / ${parentId} / ${item.kind}`);

    rows.push(row.join(""));

    if (item.kind === "branch") {
      const children = [...item.children.values()].map(
        (c) => [c, depth + 1, isLast] as [PathBranch | PathLeaf, number, boolean],
      );
      stack.unshift(...children);
    }
  }

  return "\n" + rows.join("\n");
}

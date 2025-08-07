import { expect, test } from "vitest";
import type { TreeParent, TreeRoot } from "../+types.async-tree.js";
import { applySetActionToTree } from "../apply-set-action-to-tree.js";
import { maybeApplyResize } from "../maybe-apply-resize.js";

test("maybeApplyResize: should only apply resize when necessary", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    size: 10,
    kind: "root",
  };

  applySetActionToTree(
    {
      path: [],
      size: 10,
      items: [
        { data: 2, relIndex: 0, kind: "leaf" },
        { data: 2, relIndex: 1, kind: "leaf" },
        { data: 2, relIndex: 2, kind: "leaf" },
        { data: 2, relIndex: 3, kind: "leaf" },
      ],
    },
    root,
  );

  expect(maybeApplyResize(root, 10)).toEqual(false);
  expect(maybeApplyResize(root, undefined)).toEqual(false);
  expect(maybeApplyResize(root, 8)).toEqual(true);
  expect(root.byIndex.size).toEqual(4);
  expect(maybeApplyResize(root, 2)).toEqual(true);
  expect(root.byIndex.size).toEqual(2);
});

test("maybeApplyResize: should only apply resize when necessary on parent", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    size: 10,
    kind: "root",
  };

  applySetActionToTree(
    {
      path: [],
      size: 10,
      items: [{ kind: "parent", path: "A", data: null, relIndex: 0, size: 10 }],
    },
    root,
  );

  applySetActionToTree(
    {
      path: ["A"],
      items: [
        { data: 2, relIndex: 0, kind: "leaf" },
        { data: 2, relIndex: 1, kind: "leaf" },
        { data: 2, relIndex: 2, kind: "leaf" },
        { data: 2, relIndex: 3, kind: "leaf" },
      ],
    },
    root,
  );

  const node = root.byPath.get("A")! as TreeParent<any, any>;

  expect(maybeApplyResize(node, 10)).toEqual(false);
  expect(maybeApplyResize(node, undefined)).toEqual(false);
  expect(maybeApplyResize(node, 8)).toEqual(true);
  expect(node.byIndex.size).toEqual(4);
  expect(maybeApplyResize(node, 2)).toEqual(true);
  expect(node.byIndex.size).toEqual(2);
});

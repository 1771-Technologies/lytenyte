import { expect, test, vi } from "vitest";
import type { TreeLeaf, TreeParent, TreeRoot } from "../+types.async-tree.js";
import { getParentNodeByPath } from "../get-parent-node-by-path.js";

test("getParentNodeByPath: should return the correct node", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    size: 10,
    kind: "root",
  };

  const parentA: TreeParent<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    data: null,
    relIndex: 2,
    kind: "parent",
    parent: root,
    path: "x",
    size: 10,
  };
  const parentB: TreeParent<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    data: "Path B",
    relIndex: 2,
    kind: "parent",
    parent: parentA,
    path: "b",
    size: 10,
  };
  const leaf: TreeLeaf<any, any> = {
    data: null,
    relIndex: 2,
    kind: "leaf",
    parent: parentB,
    path: "x",
  };

  root.byPath.set("x", parentA);
  parentA.byPath.set("b", parentB);
  parentB.byPath.set("x", leaf);

  expect(getParentNodeByPath(root, ["x", "b"])?.kind).toMatchInlineSnapshot(`"parent"`);
  expect(
    (getParentNodeByPath(root, ["x", "b"]) as TreeParent<any, any>).data
  ).toMatchInlineSnapshot(`"Path B"`);
});

test("getParentNodeByPath: should handle invalid paths", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    size: 10,
    kind: "root",
  };

  const parentA: TreeParent<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    data: null,
    relIndex: 2,
    kind: "parent",
    parent: root,
    path: "x",
    size: 10,
  };
  const parentB: TreeParent<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    data: "Path B",
    relIndex: 2,
    kind: "parent",
    parent: parentA,
    path: "b",
    size: 10,
  };
  const leaf: TreeLeaf<any, any> = {
    data: null,
    relIndex: 2,
    kind: "leaf",
    parent: parentB,
    path: "x",
  };

  root.byPath.set("x", parentA);
  parentA.byPath.set("b", parentB);
  parentB.byPath.set("x", leaf);

  const err = console.error;
  const fn = vi.fn();
  console.error = fn;

  expect(getParentNodeByPath(root, ["x", "b", "t"])).toMatchInlineSnapshot(`null`);

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn.mock.calls.at(0)?.at(0)).toMatchInlineSnapshot(
    `"Invalid path specified. Paths must be built up incrementally."`
  );

  expect(getParentNodeByPath(root, ["x", "b", "x"])).toMatchInlineSnapshot(`null`);
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn.mock.calls.at(1)?.at(0)).toMatchInlineSnapshot(
    `"Invalid path specified. Leaf nodes can have children."`
  );

  parentA.byPath.set("x", leaf);
  expect(getParentNodeByPath(root, ["x", "x", "b"])).toMatchInlineSnapshot(`null`);
  expect(fn).toHaveBeenCalledTimes(3);
  expect(fn.mock.calls.at(1)?.at(0)).toMatchInlineSnapshot(
    `"Invalid path specified. Leaf nodes can have children."`
  );

  console.error = err;
});

test("getParentNodeByPath: should handle null paths", () => {
  const root: TreeRoot<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    size: 10,
    kind: "root",
  };

  const parentA: TreeParent<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    data: null,
    relIndex: 2,
    kind: "parent",
    parent: root,
    path: "x",
    size: 10,
  };
  const parentB: TreeParent<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    data: "Path B",
    relIndex: 2,
    kind: "parent",
    parent: parentA,
    path: "b",
    size: 10,
  };
  const parentC: TreeParent<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    data: "Path C",
    relIndex: 2,
    kind: "parent",
    parent: parentA,
    path: "b",
    size: 10,
  };

  root.byPath.set(null, parentA);
  parentA.byPath.set("B", parentB);
  parentB.byPath.set(null, parentC);

  expect(getParentNodeByPath(root, [null, "B", null])?.kind).toMatchInlineSnapshot(`"parent"`);
  expect(
    (getParentNodeByPath(root, [null, "B", null]) as TreeParent<any, any>).data
  ).toMatchInlineSnapshot(`"Path C"`);
});

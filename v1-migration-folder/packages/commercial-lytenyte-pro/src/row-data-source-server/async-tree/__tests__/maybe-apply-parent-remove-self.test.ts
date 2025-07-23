import { expect, test } from "vitest";
import type { TreeParent, TreeRoot } from "../+types.async-tree.js";
import { maybeApplyParentRemoveSelf } from "../maybe-apply-parent-remove-self.js";

test("maybeApplyParentRemoveSelf: should only remove self if size is 0", () => {
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
    path: "A",
    size: 10,
  };
  const parentB: TreeParent<any, any> = {
    byIndex: new Map(),
    byPath: new Map(),
    data: "Path B",
    relIndex: 2,
    kind: "parent",
    parent: parentA,
    path: "B",
    size: 0,
  };

  root.byPath.set("A", parentA);
  root.byIndex.set(2, parentA);
  parentA.byPath.set("B", parentB);
  parentA.byIndex.set(2, parentB);

  expect(maybeApplyParentRemoveSelf(parentA)).toEqual(false);
  expect(root.byPath.get("A")).toEqual(parentA);

  expect(maybeApplyParentRemoveSelf(parentB)).toEqual(true);
  expect(parentA.byPath.get("B")).toEqual(undefined);
  expect(parentA.byIndex.get(2)).toEqual(undefined);

  (parentA as { size: number }).size = 0;
  expect(maybeApplyParentRemoveSelf(parentA)).toEqual(true);
  expect(root.byPath.get("A")).toEqual(undefined);
  expect(root.byIndex.get(2)).toEqual(undefined);
});

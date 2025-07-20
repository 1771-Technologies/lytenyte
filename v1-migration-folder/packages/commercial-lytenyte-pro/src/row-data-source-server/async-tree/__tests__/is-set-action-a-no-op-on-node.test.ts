import { expect, test } from "vitest";
import type { TreeParent } from "../+types.async-tree.js";
import { isSetActionANoOpOnNode } from "../is-set-action-a-no-op-on-node.js";

test("isSetActionANoOpOnNode", () => {
  expect(
    isSetActionANoOpOnNode({ path: [], size: 10 }, { size: 10 } as TreeParent<any, any>)
  ).toEqual(true);

  expect(
    isSetActionANoOpOnNode({ path: [], size: 21 }, { size: 10 } as TreeParent<any, any>)
  ).toEqual(false);

  expect(
    isSetActionANoOpOnNode({ path: [], size: 10, items: [2 as any] }, { size: 10 } as TreeParent<
      any,
      any
    >)
  ).toEqual(false);
});

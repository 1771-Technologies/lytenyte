import { expect, test, vi } from "vitest";
import type { SetDataAction, TreeParent, TreeRoot } from "../+types.async-tree.js";
import { checkSetActionItemKeysFit } from "../check-set-action-item-keys-fit.js";

const pathNode: TreeParent<any, any> = {
  byIndex: new Map(),
  byPath: new Map(),
  data: null,
  relIndex: 0,
  kind: "parent",
  parent: null as unknown as TreeRoot<any, any>,
  path: null,
  size: 10,
};

test("checkSetActionItemKeysFit: should return the correct result", () => {
  const err = console.error;
  const fn = vi.fn();
  console.error = fn;

  const p: SetDataAction = { path: [], items: [{ relIndex: 12, kind: "leaf", data: 1 }] };

  expect(checkSetActionItemKeysFit(p, pathNode)).toEqual(false);
  expect(fn).toHaveBeenCalledOnce();
  expect(fn.mock.calls.at(0)?.at(0)).toMatchInlineSnapshot(
    `"Invalid set action items, 'relIndex' must be less than parent size"`,
  );

  expect(
    checkSetActionItemKeysFit(
      { path: [], items: [{ relIndex: 2, kind: "leaf", data: 1 }] },
      pathNode,
    ),
  ).toEqual(true);

  console.error = err;
});

test("checkSetActionItemKeysFit: should return true if the items are empty or not defined", () => {
  expect(checkSetActionItemKeysFit({ path: [] }, pathNode)).toEqual(true);
  expect(checkSetActionItemKeysFit({ path: [], items: [] }, pathNode)).toEqual(true);
});

test("checkSetActionItemKeysFit: should respect the payload size when it is being set", () => {
  const err = console.error;
  const fn = vi.fn();
  console.error = fn;

  const p: SetDataAction = { path: [], size: 8, items: [{ relIndex: 9, kind: "leaf", data: 1 }] };

  expect(checkSetActionItemKeysFit(p, pathNode)).toEqual(false);
  expect(fn).toHaveBeenCalledOnce();
  expect(fn.mock.calls.at(0)?.at(0)).toMatchInlineSnapshot(
    `"Invalid set action items, 'relIndex' must be less than parent size"`,
  );

  expect(
    checkSetActionItemKeysFit(
      { path: [], size: 15, items: [{ relIndex: 13, kind: "leaf", data: 1 }] },
      pathNode,
    ),
  ).toEqual(true);

  console.error = err;
});

import { expect, test, vi } from "vitest";
import type { SetDataAction } from "../+types.async-tree.js";
import { checkSetActionItemKinds } from "../check-set-action-item-kinds.js";

test("checkSetActionItemKinds: should return the correct result", () => {
  const err = console.error;
  const fn = vi.fn();
  console.error = fn;
  let p: SetDataAction = {
    path: ["x"],
    items: [
      { relIndex: 2, data: 1, kind: "leaf" },
      { relIndex: 4, data: 1, kind: "leaf" },
      { relIndex: 2, data: 1, kind: "bob" as unknown as "leaf" },
    ],
  };

  expect(checkSetActionItemKinds(p)).toEqual(false);
  expect(fn).toHaveBeenCalledOnce();
  expect(fn.mock.calls.at(0)?.at(0)).toMatchInlineSnapshot(
    `"Invalid set action items, 'kind' must be 'leaf' or 'parent'"`,
  );

  p = {
    path: ["x"],
    items: [
      { relIndex: 2, data: 1, kind: "parent", path: "x", size: 11 },
      { relIndex: 4, data: 1, kind: "parent", path: "z", size: 1 },
      { relIndex: 2, data: 1, kind: "bob" as unknown as "leaf" },
    ],
  };

  expect(checkSetActionItemKinds(p)).toEqual(false);
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn.mock.calls.at(1)?.at(0)).toMatchInlineSnapshot(
    `"Invalid set action items, 'kind' must be 'leaf' or 'parent'"`,
  );

  const pFine: SetDataAction = {
    path: ["x"],
    items: [
      { relIndex: 2, data: 1, kind: "leaf" },
      { relIndex: 4, data: 1, kind: "leaf" },
      { relIndex: 3, data: 1, kind: "leaf" },
    ],
  };

  expect(checkSetActionItemKinds(pFine)).toEqual(true);
  expect(fn).toHaveBeenCalledTimes(2);

  console.error = err;
});

test("checkSetActionItemKinds: should return true if items are empty or not defined", () => {
  expect(checkSetActionItemKinds({ path: [] })).toEqual(true);
  expect(checkSetActionItemKinds({ path: [], items: [] })).toEqual(true);
});

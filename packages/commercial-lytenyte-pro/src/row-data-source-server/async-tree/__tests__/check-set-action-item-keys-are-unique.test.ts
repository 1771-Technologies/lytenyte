import { expect, test, vi } from "vitest";
import type { SetDataAction } from "../+types.async-tree.js";
import { checkSetActionItemKeysAreUnique } from "../check-set-action-item-keys-are-unique.js";

test("checkSetActionItemKeysAreUnique: should return the correct result", () => {
  const err = console.error;
  const fn = vi.fn();
  console.error = fn;
  const p: SetDataAction = {
    path: ["x"],
    items: [
      { relIndex: 2, data: 1, kind: "leaf" },
      { relIndex: 4, data: 1, kind: "leaf" },
      { relIndex: 2, data: 1, kind: "leaf" },
    ],
  };

  expect(checkSetActionItemKeysAreUnique(p)).toEqual(false);
  expect(fn).toHaveBeenCalledOnce();
  expect(fn.mock.calls.at(0)?.at(0)).toMatchInlineSnapshot(
    `"Invalid set action items, the same 'key' appears more than once"`,
  );

  const pFine: SetDataAction = {
    path: ["x"],
    items: [
      { relIndex: 2, data: 1, kind: "leaf" },
      { relIndex: 4, data: 1, kind: "leaf" },
      { relIndex: 3, data: 1, kind: "leaf" },
    ],
  };

  expect(checkSetActionItemKeysAreUnique(pFine)).toEqual(true);
  expect(fn).toHaveBeenCalledOnce();

  console.error = err;
});

test("checkSetActionItemKeysAreUnique: should return the correct result with a mix of parents and leafs", () => {
  const err = console.error;
  const fn = vi.fn();
  console.error = fn;
  const p: SetDataAction = {
    path: ["x"],
    items: [
      { relIndex: 2, data: 1, kind: "leaf" },
      { relIndex: 4, data: 1, kind: "leaf" },
      { relIndex: 2, data: 1, kind: "parent", path: "x", size: 1 },
      { relIndex: 3, data: 1, kind: "parent", path: "z", size: 1 },
    ],
  };

  expect(checkSetActionItemKeysAreUnique(p)).toEqual(false);
  expect(fn).toHaveBeenCalledOnce();
  expect(fn.mock.calls.at(0)?.at(0)).toMatchInlineSnapshot(
    `"Invalid set action items, the same 'key' appears more than once"`,
  );

  const pFine: SetDataAction = {
    path: ["x"],
    items: [
      { relIndex: 2, data: 1, kind: "leaf" },
      { relIndex: 4, data: 1, kind: "leaf" },
      { relIndex: 5, data: 1, kind: "parent", path: "x", size: 1 },
      { relIndex: 3, data: 1, kind: "parent", path: "z", size: 1 },
    ],
  };

  expect(checkSetActionItemKeysAreUnique(pFine)).toEqual(true);
  expect(fn).toHaveBeenCalledOnce();

  console.error = err;
});

test("checkSetActionItemKeysAreUnique: should return the correct result with a mix of parents and leafs", () => {
  const err = console.error;
  const fn = vi.fn();
  console.error = fn;
  const p: SetDataAction = {
    path: ["x"],
    items: [
      { relIndex: 2, data: 1, kind: "leaf" },
      { relIndex: 4, data: 1, kind: "leaf" },
      { relIndex: 2, data: 1, kind: "parent", path: "x", size: 1 },
      { relIndex: 5, data: 1, kind: "parent", path: "x", size: 1 },
    ],
  };

  expect(checkSetActionItemKeysAreUnique(p)).toEqual(false);
  expect(fn).toHaveBeenCalledOnce();
  expect(fn.mock.calls.at(0)?.at(0)).toMatchInlineSnapshot(
    `"Invalid set action items, the same 'path' appears more than once"`,
  );

  const pFine: SetDataAction = {
    path: ["x"],
    items: [
      { relIndex: 2, data: 1, kind: "leaf" },
      { relIndex: 4, data: 1, kind: "leaf" },
      { relIndex: 5, data: 1, kind: "parent", path: "x", size: 1 },
      { relIndex: 3, data: 1, kind: "parent", path: "z", size: 1 },
    ],
  };

  expect(checkSetActionItemKeysAreUnique(pFine)).toEqual(true);
  expect(fn).toHaveBeenCalledOnce();

  console.error = err;
});

test("checkSetActionItemKeysAreUnique: should return true when the items are empty or not defined on the payload", () => {
  expect(checkSetActionItemKeysAreUnique({ path: [] })).toEqual(true);
  expect(checkSetActionItemKeysAreUnique({ path: [], items: [] })).toEqual(true);
});

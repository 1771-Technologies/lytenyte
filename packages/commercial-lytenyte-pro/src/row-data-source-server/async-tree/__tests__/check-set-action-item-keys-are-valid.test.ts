import { expect, test, vi } from "vitest";
import type { SetDataAction } from "../+types.async-tree.js";
import { checkSetActionItemKeysAreValid } from "../check-set-action-item-keys-are-valid.js";

test("checkSetActionItemKeysAreValid: should return the correct result", () => {
  const err = console.error;
  const fn = vi.fn();
  console.error = fn;

  const p: SetDataAction = {
    path: ["x"],
    items: [
      { relIndex: 2, data: 1, kind: "leaf" },
      { relIndex: 4, data: 1, kind: "leaf" },
      { relIndex: 1, data: 1, kind: "leaf" },
    ],
  };

  expect(checkSetActionItemKeysAreValid(p)).toEqual(true);

  const pWithNegativeKey: SetDataAction = {
    path: [],
    items: [{ relIndex: -2, data: 1, kind: "leaf" }],
  };
  expect(checkSetActionItemKeysAreValid(pWithNegativeKey)).toEqual(false);
  expect(fn).toHaveBeenCalledOnce();
  expect(fn.mock.calls.at(0)?.at(0)).toMatchInlineSnapshot(
    `"Invalid set action items, 'relIndex' must be a positive integer"`,
  );

  const pNonNumber: SetDataAction = {
    path: [],
    items: [{ relIndex: "2" as unknown as number, data: 1, kind: "leaf" }],
  };
  expect(checkSetActionItemKeysAreValid(pNonNumber)).toEqual(false);
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn.mock.calls.at(1)?.at(0)).toMatchInlineSnapshot(
    `"Invalid set action items, 'relIndex' must be a positive integer"`,
  );

  const pWithFloat: SetDataAction = {
    path: [],
    items: [{ relIndex: 2.4, data: 1, kind: "leaf" }],
  };
  expect(checkSetActionItemKeysAreValid(pWithFloat)).toEqual(false);
  expect(fn).toHaveBeenCalledTimes(3);
  expect(fn.mock.calls.at(1)?.at(0)).toMatchInlineSnapshot(
    `"Invalid set action items, 'relIndex' must be a positive integer"`,
  );

  console.error = err;
});

test("checkSetActionItemKeysAreValid: should return true if the items are empty or not defined", () => {
  expect(checkSetActionItemKeysAreValid({ path: [], items: [] })).toEqual(true);
  expect(checkSetActionItemKeysAreValid({ path: [] })).toEqual(true);
});

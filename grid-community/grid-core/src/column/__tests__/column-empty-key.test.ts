import { test, expect } from "vitest";
import { COLUMN_EMPTY_PREFIX } from "@1771technologies/grid-constants";
import type { ColumnPin } from "@1771technologies/grid-types/core";
import { columnEmptyKey } from "../column-empty-key.js";

test("should generate correct key for empty group path and no pin", () => {
  const result = columnEmptyKey([], null);
  expect(result).toBe(`${COLUMN_EMPTY_PREFIX}|>empty`);
});

test("should generate correct key for single group and no pin", () => {
  const result = columnEmptyKey(["group1"], null);
  expect(result).toBe(`${COLUMN_EMPTY_PREFIX}group1|>empty`);
});

test("should generate correct key for multiple groups and no pin", () => {
  const result = columnEmptyKey(["group1", "group2", "group3"], null);
  expect(result).toBe(`${COLUMN_EMPTY_PREFIX}group1|>group2|>group3|>empty`);
});

test("should generate correct key with pin value", () => {
  const pin: ColumnPin = "start";
  const result = columnEmptyKey(["group1"], pin);
  expect(result).toBe(`${COLUMN_EMPTY_PREFIX}group1|>emptystart`);
});

test("should handle special characters in group names", () => {
  const result = columnEmptyKey(["group|>1", "group.2"], null);
  expect(result).toBe(`${COLUMN_EMPTY_PREFIX}group|>1|>group.2|>empty`);
});

test("should generate different keys for different pins with same group", () => {
  const groupPath = ["group1"];
  const leftPin: ColumnPin = "start";
  const rightPin: ColumnPin = "end";

  const leftResult = columnEmptyKey(groupPath, leftPin);
  const rightResult = columnEmptyKey(groupPath, rightPin);

  expect(leftResult).not.toBe(rightResult);
  expect(leftResult).toBe(`${COLUMN_EMPTY_PREFIX}group1|>emptystart`);
  expect(rightResult).toBe(`${COLUMN_EMPTY_PREFIX}group1|>emptyend`);
});

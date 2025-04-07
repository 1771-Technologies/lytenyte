import { test, expect } from "vitest";
import { COLUMN_EMPTY_PREFIX } from "@1771technologies/grid-constants";
import { columnIsEmpty, columnIsEmptyById } from "../column-is-empty.js";

test("isEmptyColumn should return true for column with empty prefix", () => {
  const column = { id: `${COLUMN_EMPTY_PREFIX}test`, name: "Test" };
  expect(columnIsEmpty(column)).toBe(true);
});

test("isEmptyColumn should return false for regular column", () => {
  const column = { id: "regular-column", name: "Test" };
  expect(columnIsEmpty(column)).toBe(false);
});

test("isEmptyColumnById should return true for id with empty prefix", () => {
  const id = `${COLUMN_EMPTY_PREFIX}test`;
  expect(columnIsEmptyById(id)).toBe(true);
});

test("isEmptyColumnById should return false for regular id", () => {
  const id = "regular-column";
  expect(columnIsEmptyById(id)).toBe(false);
});

test("isEmptyColumnById should return false for empty string", () => {
  expect(columnIsEmptyById("")).toBe(false);
});

test("isEmptyColumnById should handle case where prefix appears mid-string", () => {
  const id = `test${COLUMN_EMPTY_PREFIX}something`;
  expect(columnIsEmptyById(id)).toBe(false);
});

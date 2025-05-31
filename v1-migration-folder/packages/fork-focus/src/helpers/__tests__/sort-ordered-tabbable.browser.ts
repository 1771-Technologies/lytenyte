import { beforeEach, expect, test, vi } from "vitest";
import { sortOrderedTabbables } from "../sort-ordered-tabbables.js";

beforeEach(() => {
  vi.restoreAllMocks();
});

test("sortOrderedTabbables: sorts by tabIndex when tabIndex values differ", () => {
  const a = { tabIndex: 1, documentOrder: 0 };
  const b = { tabIndex: 2, documentOrder: 0 };

  expect(sortOrderedTabbables(a, b)).toBeLessThan(0);
  expect(sortOrderedTabbables(b, a)).toBeGreaterThan(0);
});

test("sortOrderedTabbables: sorts by documentOrder when tabIndex values are equal", () => {
  const a = { tabIndex: 1, documentOrder: 3 };
  const b = { tabIndex: 1, documentOrder: 5 };

  expect(sortOrderedTabbables(a, b)).toBeLessThan(0);
  expect(sortOrderedTabbables(b, a)).toBeGreaterThan(0);
});

test("sortOrderedTabbables: returns 0 if both tabIndex and documentOrder are equal", () => {
  const a = { tabIndex: 1, documentOrder: 5 };
  const b = { tabIndex: 1, documentOrder: 5 };

  expect(sortOrderedTabbables(a, b)).toBe(0);
});

import { test, expect, vi, beforeEach, type Mock } from "vitest";
import { sortByOrder } from "../sort-by-order";
import type { CandidateScope } from "../get-candidates-iteratively";

// Mocks
vi.mock("../get-sort-order-tab-index", () => ({
  getSortOrderTabIndex: vi.fn(),
}));

vi.mock("../sort-ordered-tabbables", () => ({
  sortOrderedTabbables: vi.fn(
    (a, b) => a.tabIndex - b.tabIndex || a.documentOrder - b.documentOrder,
  ),
}));

const { getSortOrderTabIndex } = await import("../get-sort-order-tab-index");

beforeEach(() => {
  vi.restoreAllMocks();
});

test("sortByOrder: returns single regular tabbable element", () => {
  const el = document.createElement("button");

  (getSortOrderTabIndex as Mock).mockReturnValue(0);

  const result = sortByOrder([el]);
  expect(result).toEqual([el]);
});

test("sortByOrder: sorts elements with positive tabIndex before regular tabbables", () => {
  const el1 = document.createElement("button");
  const el2 = document.createElement("button");

  (getSortOrderTabIndex as Mock)
    .mockReturnValueOnce(2) // el1
    .mockReturnValueOnce(0); // el2

  const result = sortByOrder([el1, el2]);
  expect(result).toEqual([el1, el2]);
});

test("sortByOrder: sorts based on tabIndex and document order", () => {
  const el1 = document.createElement("button"); // tabindex 1
  const el2 = document.createElement("button"); // tabindex 2
  const el3 = document.createElement("button"); // tabindex 1, appears later

  (getSortOrderTabIndex as Mock)
    .mockReturnValueOnce(1)
    .mockReturnValueOnce(2)
    .mockReturnValueOnce(1);

  const result = sortByOrder([el1, el2, el3]);
  expect(result).toEqual([el1, el3, el2]);
});

test("sortByOrder: recursively sorts and flattens CandidateScope", () => {
  const el1 = document.createElement("button");
  const el2 = document.createElement("button");

  const scope: CandidateScope = {
    scopeParent: document.createElement("div"),
    candidates: [el1, el2],
  };

  (getSortOrderTabIndex as Mock)
    .mockReturnValueOnce(0) // scopeParent is regular
    .mockReturnValueOnce(2) // el1
    .mockReturnValueOnce(1); // el2

  const result = sortByOrder([scope]);
  expect(result).toEqual([el2, el1]); // Sorted inside scope, flattened
});

test("sortByOrder: sorts scope parent by tabIndex and flattens contents", () => {
  const el1 = document.createElement("button");
  const el2 = document.createElement("button");

  const scope: CandidateScope = {
    scopeParent: document.createElement("div"),
    candidates: [el1, el2],
  };

  (getSortOrderTabIndex as Mock)
    .mockReturnValueOnce(3) // scopeParent
    .mockReturnValueOnce(0) // el1
    .mockReturnValueOnce(1); // el2

  const result = sortByOrder([scope]);

  // scopeParent is ordered, content is flattened: [el2, el1]
  expect(result).toEqual([el2, el1]);
});

test("sortByOrder: mixes ordered and regular elements correctly", () => {
  const el1 = document.createElement("button");
  const el2 = document.createElement("button");
  const el3 = document.createElement("button");

  (getSortOrderTabIndex as Mock)
    .mockReturnValueOnce(3) // el1
    .mockReturnValueOnce(0) // el2
    .mockReturnValueOnce(1); // el3

  const result = sortByOrder([el1, el2, el3]);
  expect(result).toEqual([el3, el1, el2]); // Ordered first, then regular
});

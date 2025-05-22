import { beforeEach, expect, test, vi } from "vitest";
import { getSortOrderTabIndex } from "../get-sort-order-tab-index";

// Mock getTabIndex and hasTabIndex
vi.mock("@1771technologies/lytenyte-dom-utils", () => ({
  getTabIndex: vi.fn(),
  hasTabIndex: vi.fn(),
}));

beforeEach(() => {
  vi.restoreAllMocks();
});

const { getTabIndex, hasTabIndex } = await import("@1771technologies/lytenyte-dom-utils");

const mockGetTabIndex = getTabIndex as unknown as any;
const mockHasTabIndex = hasTabIndex as unknown as any;

test("returns tabIndex if tabIndex >= 0", () => {
  const node = document.createElement("div");

  mockGetTabIndex.mockReturnValue(2);
  mockHasTabIndex.mockReturnValue(true);

  const result = getSortOrderTabIndex(node, true);
  expect(result).toBe(2);
});

test("returns tabIndex if isScope is false (even with negative tabIndex)", () => {
  const node = document.createElement("div");

  mockGetTabIndex.mockReturnValue(-1);
  mockHasTabIndex.mockReturnValue(false);

  const result = getSortOrderTabIndex(node, false);
  expect(result).toBe(-1);
});

test("returns tabIndex if hasTabIndex is true (even with negative tabIndex and isScope)", () => {
  const node = document.createElement("div");

  mockGetTabIndex.mockReturnValue(-1);
  mockHasTabIndex.mockReturnValue(true);

  const result = getSortOrderTabIndex(node, true);
  expect(result).toBe(-1);
});

test("returns 0 if tabIndex < 0, isScope is true, and hasTabIndex is false", () => {
  const node = document.createElement("div");

  mockGetTabIndex.mockReturnValue(-1);
  mockHasTabIndex.mockReturnValue(false);

  const result = getSortOrderTabIndex(node, true);
  expect(result).toBe(0);
});

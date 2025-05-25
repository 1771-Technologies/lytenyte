import { test, expect, vi, beforeEach, type Mock } from "vitest";
import { isNodeMatchingSelectorTabbable } from "../is-node-matching-selector-tabbable.js";
import type { CheckOptions } from "../../+types.focus.js";

// Mock dependencies
vi.mock("@1771technologies/lytenyte-dom-utils", () => ({
  getTabIndex: vi.fn(),
  isNonTabbableRadio: vi.fn(),
}));

vi.mock("../is-node-matching-selector-focusable", () => ({
  isNodeMatchingSelectorFocusable: vi.fn(),
}));

const { getTabIndex, isNonTabbableRadio } = await import("@1771technologies/lytenyte-dom-utils");
const { isNodeMatchingSelectorFocusable } = await import("../is-node-matching-selector-focusable");

beforeEach(() => {
  vi.restoreAllMocks();

  (getTabIndex as Mock).mockReturnValue(0);
  (isNonTabbableRadio as unknown as Mock).mockReturnValue(false);
  (isNodeMatchingSelectorFocusable as Mock).mockReturnValue(true);
});

const options: CheckOptions = { displayCheck: "full", getShadowRoot: true };

test("isNodeMatchingSelectorTabbable: returns false if node is a non-tabbable radio", () => {
  const node = document.createElement("input");

  (isNonTabbableRadio as unknown as Mock).mockReturnValue(true);

  const result = isNodeMatchingSelectorTabbable(options, node);
  expect(result).toBe(false);
});

test("isNodeMatchingSelectorTabbable: returns false if tabIndex < 0", () => {
  const node = document.createElement("input");

  (getTabIndex as Mock).mockReturnValue(-1);

  const result = isNodeMatchingSelectorTabbable(options, node);
  expect(result).toBe(false);
});

test("isNodeMatchingSelectorTabbable: returns false if node is not focusable", () => {
  const node = document.createElement("input");

  (isNodeMatchingSelectorFocusable as Mock).mockReturnValue(false);

  const result = isNodeMatchingSelectorTabbable(options, node);
  expect(result).toBe(false);
});

test("isNodeMatchingSelectorTabbable: returns true if all conditions pass", () => {
  const node = document.createElement("input");

  const result = isNodeMatchingSelectorTabbable(options, node);
  expect(result).toBe(true);
});

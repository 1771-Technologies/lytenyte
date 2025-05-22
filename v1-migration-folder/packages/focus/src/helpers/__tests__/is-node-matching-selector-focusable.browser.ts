import { describe, expect, test, vi, beforeEach, type Mock } from "vitest";
import { isNodeMatchingSelectorFocusable } from "../is-node-matching-selector-focusable";
import type { CheckOptions } from "../../+types.focus";

// Mocks
vi.mock("@1771technologies/lytenyte-dom-utils", () => ({
  isInert: vi.fn(),
  isHiddenInput: vi.fn(),
  isDetailsWithSummary: vi.fn(),
  isDisabledFromFieldset: vi.fn(),
}));

vi.mock("../is-hidden", () => ({
  isHidden: vi.fn(),
}));

// Import mocks after mocking
const { isInert, isHiddenInput, isDetailsWithSummary, isDisabledFromFieldset } = await import(
  "@1771technologies/lytenyte-dom-utils"
);
const { isHidden } = await import("../is-hidden");

const mockAllFalse = () => {
  (isInert as Mock).mockReturnValue(false);
  (isHiddenInput as unknown as Mock).mockReturnValue(false);
  (isDetailsWithSummary as unknown as Mock).mockReturnValue(false);
  (isDisabledFromFieldset as Mock).mockReturnValue(false);
  (isHidden as Mock).mockReturnValue(false);
};

beforeEach(() => {
  vi.restoreAllMocks();
  mockAllFalse();
});

const options: CheckOptions = { displayCheck: "full", getShadowRoot: true };

describe("isNodeMatchingSelectorFocusable", () => {
  test("returns false if node is disabled", () => {
    const node = document.createElement("input");
    node.disabled = true;

    expect(isNodeMatchingSelectorFocusable(options, node)).toBe(false);
  });

  test("returns false if node is inert", () => {
    const node = document.createElement("div");
    (isInert as Mock).mockReturnValue(true);

    expect(isNodeMatchingSelectorFocusable(options, node)).toBe(false);
  });

  test("returns false if node is a hidden input", () => {
    const node = document.createElement("input");
    (isHiddenInput as unknown as Mock).mockReturnValue(true);

    expect(isNodeMatchingSelectorFocusable(options, node)).toBe(false);
  });

  test("returns false if node is hidden by CSS or DOM state", () => {
    const node = document.createElement("div");
    (isHidden as Mock).mockReturnValue(true);

    expect(isNodeMatchingSelectorFocusable(options, node)).toBe(false);
  });

  test("returns false if node is a <details> with summary", () => {
    const node = document.createElement("details");
    (isDetailsWithSummary as unknown as Mock).mockReturnValue(true);

    expect(isNodeMatchingSelectorFocusable(options, node)).toBe(false);
  });

  test("returns false if node is disabled from a fieldset", () => {
    const node = document.createElement("input");
    (isDisabledFromFieldset as Mock).mockReturnValue(true);

    expect(isNodeMatchingSelectorFocusable(options, node)).toBe(false);
  });

  test("returns true if all conditions are clear", () => {
    const node = document.createElement("input");

    expect(isNodeMatchingSelectorFocusable(options, node)).toBe(true);
  });
});

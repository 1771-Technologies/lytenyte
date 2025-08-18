import { describe, expect, test, vi, beforeEach, type Mock } from "vitest";
import { focusable, isFocusable } from "../focusable.js";

// Mocks
vi.mock("../helpers/get-candidates", () => ({
  getCandidates: vi.fn(),
}));

vi.mock("../helpers/get-candidates-iteratively", () => ({
  getCandidatesIteratively: vi.fn(),
}));

vi.mock("../helpers/is-node-matching-selector-focusable", () => ({
  isNodeMatchingSelectorFocusable: vi.fn(),
}));

vi.mock("@1771technologies/lytenyte-dom-utils", () => ({
  matches: vi.fn(),
}));

const { getCandidates } = await import("../helpers/get-candidates");
const { getCandidatesIteratively } = await import("../helpers/get-candidates-iteratively");
const { isNodeMatchingSelectorFocusable } = await import(
  "../helpers/is-node-matching-selector-focusable"
);
const { matches } = await import("@1771technologies/lytenyte-dom-utils");

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("focusable", () => {
  test("calls getCandidatesIteratively when getShadowRoot is truthy", () => {
    const container = document.createElement("div");
    const mockElements = [document.createElement("input")];

    (getCandidatesIteratively as Mock).mockReturnValue(mockElements);

    const result = focusable(container, { getShadowRoot: true });
    expect(getCandidatesIteratively).toHaveBeenCalled();
    expect(getCandidates).not.toHaveBeenCalled();
    expect(result).toBe(mockElements);
  });

  test("calls getCandidates when getShadowRoot is falsy", () => {
    const container = document.createElement("div");
    const mockElements = [document.createElement("input")];

    (getCandidates as Mock).mockReturnValue(mockElements);

    const result = focusable(container, { getShadowRoot: false });
    expect(getCandidates).toHaveBeenCalled();
    expect(getCandidatesIteratively).not.toHaveBeenCalled();
    expect(result).toBe(mockElements);
  });

  test("defaults to options.includeContainer = false", () => {
    const container = document.createElement("div");
    (getCandidates as Mock).mockReturnValue([]);

    focusable(container);
    expect(getCandidates).toHaveBeenCalledWith(container, false, expect.any(Function));
  });
});

describe("isFocusable", () => {
  test("returns false if node does not match selector", () => {
    const node = document.createElement("input");
    (matches as Mock).mockReturnValue(false);

    const result = isFocusable(node);
    expect(result).toBe(false);
    expect(isNodeMatchingSelectorFocusable).not.toHaveBeenCalled();
  });

  test("returns result of isNodeMatchingSelectorFocusable if selector matches", () => {
    const node = document.createElement("button");
    (matches as Mock).mockReturnValue(true);
    (isNodeMatchingSelectorFocusable as Mock).mockReturnValue(true);

    const result = isFocusable(node);
    expect(result).toBe(true);
    expect(isNodeMatchingSelectorFocusable).toHaveBeenCalledWith({}, node);
  });

  test("uses default options if not provided", () => {
    const node = document.createElement("button");
    (matches as Mock).mockReturnValue(true);
    (isNodeMatchingSelectorFocusable as Mock).mockReturnValue(true);

    const result = isFocusable(node);
    expect(result).toBe(true);
  });
});

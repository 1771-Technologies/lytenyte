import { describe, test, expect, vi, beforeEach, type Mock } from "vitest";
import { tabbable, isTabbable } from "../tabbable";

// Mocks
vi.mock("../helpers/get-candidates", () => ({
  getCandidates: vi.fn(),
}));

vi.mock("../helpers/get-candidates-iteratively", () => ({
  getCandidatesIteratively: vi.fn(),
}));

vi.mock("../helpers/is-node-matching-selector-tabbable", () => ({
  isNodeMatchingSelectorTabbable: vi.fn(),
}));

vi.mock("../helpers/sort-by-order", () => ({
  sortByOrder: vi.fn(),
}));

vi.mock("../helpers/is-shadow-root-tabbable", () => ({
  isShadowRootTabbable: vi.fn(),
}));

vi.mock("@1771technologies/lytenyte-dom-utils", () => ({
  matches: vi.fn(),
}));

const { getCandidates } = await import("../helpers/get-candidates");
const { getCandidatesIteratively } = await import("../helpers/get-candidates-iteratively");
const { isNodeMatchingSelectorTabbable } = await import(
  "../helpers/is-node-matching-selector-tabbable"
);
const { sortByOrder } = await import("../helpers/sort-by-order");
const { matches } = await import("@1771technologies/lytenyte-dom-utils");

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("tabbable", () => {
  test("uses getCandidatesIteratively if getShadowRoot is true", () => {
    const el = document.createElement("div");
    const resultElements = [document.createElement("input")];
    (getCandidatesIteratively as Mock).mockReturnValue(resultElements);
    (sortByOrder as Mock).mockImplementation((els) => els);

    const result = tabbable(el, { getShadowRoot: () => true });

    expect(getCandidatesIteratively).toHaveBeenCalled();
    expect(getCandidates).not.toHaveBeenCalled();
    expect(sortByOrder).toHaveBeenCalledWith(resultElements);
    expect(result).toEqual(resultElements);
  });

  test("uses getCandidates if getShadowRoot is false", () => {
    const el = document.createElement("div");
    const resultElements = [document.createElement("input")];
    (getCandidates as Mock).mockReturnValue(resultElements);
    (sortByOrder as Mock).mockImplementation((els) => els);

    const result = tabbable(el, { getShadowRoot: false });

    expect(getCandidates).toHaveBeenCalled();
    expect(getCandidatesIteratively).not.toHaveBeenCalled();
    expect(sortByOrder).toHaveBeenCalledWith(resultElements);
    expect(result).toEqual(resultElements);
  });

  test("defaults includeContainer to false if not specified", () => {
    const el = document.createElement("div");
    (getCandidates as Mock).mockReturnValue([]);
    (sortByOrder as Mock).mockReturnValue([]);

    tabbable(el);
    expect(getCandidates).toHaveBeenCalledWith(el, false, expect.any(Function));
  });
});

describe("isTabbable", () => {
  test("returns false if node doesn't match CANDIDATE_SELECTOR", () => {
    const node = document.createElement("input");
    (matches as Mock).mockReturnValue(false);

    const result = isTabbable(node);
    expect(result).toBe(false);
    expect(isNodeMatchingSelectorTabbable).not.toHaveBeenCalled();
  });

  test("calls isNodeMatchingSelectorTabbable if node matches selector", () => {
    const node = document.createElement("input");
    (matches as Mock).mockReturnValue(true);
    (isNodeMatchingSelectorTabbable as Mock).mockReturnValue(true);

    const result = isTabbable(node);
    expect(isNodeMatchingSelectorTabbable).toHaveBeenCalledWith({}, node);
    expect(result).toBe(true);
  });

  test("uses default options if none provided", () => {
    const node = document.createElement("input");
    (matches as Mock).mockReturnValue(true);
    (isNodeMatchingSelectorTabbable as Mock).mockReturnValue(true);

    expect(isTabbable(node)).toBe(true);
  });
});

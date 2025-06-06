import { describe, test, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { scrollContainers } from "../scroll-containers.js";
import {
  getOverflowAncestors,
  isElement,
  getDocumentElement,
} from "@1771technologies/lytenyte-dom-utils";

vi.mock("@1771technologies/lytenyte-dom-utils", () => ({
  getOverflowAncestors: vi.fn(),
  isElement: vi.fn(),
  getDocumentElement: vi.fn(),
}));

describe("scrollContainers", () => {
  let mockElement: HTMLElement;
  let mockOverflowContainer: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement("div");
    document.body.appendChild(mockElement);

    // @ts-expect-error fill in for JsDom
    document.elementFromPoint = () => {};
    vi.spyOn(document, "elementFromPoint").mockReturnValue(mockElement);

    mockOverflowContainer = document.createElement("div");
    Object.defineProperty(mockOverflowContainer, "getBoundingClientRect", {
      value: () => ({
        top: 100,
        bottom: 300,
        left: 100,
        right: 300,
        width: 200,
        height: 200,
      }),
    });

    mockOverflowContainer.scrollTop = 100;
    mockOverflowContainer.scrollLeft = 100;

    (getOverflowAncestors as Mock).mockReturnValue([mockOverflowContainer]);
    (isElement as unknown as Mock).mockImplementation(() => true);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  test("scrolls vertically up when near the top", () => {
    scrollContainers({ x: 150, y: 105 }, 10, 5);
    expect(mockOverflowContainer.scrollTop).toBe(95);
  });

  test("scrolls vertically down when near the bottom", () => {
    scrollContainers({ x: 150, y: 295 }, 10, 5);
    expect(mockOverflowContainer.scrollTop).toBe(105);
  });

  test("scrolls horizontally left when near the left", () => {
    scrollContainers({ x: 105, y: 150 }, 10, 5);
    expect(mockOverflowContainer.scrollLeft).toBe(95);
  });

  test("scrolls horizontally right when near the right", () => {
    scrollContainers({ x: 295, y: 150 }, 10, 5);
    expect(mockOverflowContainer.scrollLeft).toBe(105);
  });

  test("does not scroll if not near any edge", () => {
    scrollContainers({ x: 150, y: 150 }, 10, 5);
    expect(mockOverflowContainer.scrollTop).toBe(100);
    expect(mockOverflowContainer.scrollLeft).toBe(100);
  });

  test("returns early if no element is found", () => {
    vi.spyOn(document, "elementFromPoint").mockReturnValue(null);
    scrollContainers({ x: 0, y: 0 }, 10, 5);
    expect(getOverflowAncestors).not.toHaveBeenCalled();
  });

  test("uses documentElement when container is not an element", () => {
    const docEl = document.documentElement;
    docEl.scrollTop = 200;
    docEl.scrollLeft = 200;

    (getOverflowAncestors as Mock).mockReturnValue([{}]);
    (isElement as unknown as Mock).mockReturnValue(false);
    (getDocumentElement as Mock).mockReturnValue(docEl);

    Object.defineProperty(docEl, "getBoundingClientRect", {
      value: () => ({
        top: 100,
        bottom: 300,
        left: 100,
        right: 300,
        width: 200,
        height: 200,
      }),
    });

    scrollContainers({ x: 105, y: 105 }, 10, 5);
    expect(docEl.scrollTop).toBe(195);
    expect(docEl.scrollLeft).toBe(195);
  });
});

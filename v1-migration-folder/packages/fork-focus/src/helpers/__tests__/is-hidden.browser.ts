import { beforeEach, expect, test, vi, type Mock } from "vitest";
import { isHidden } from "../is-hidden.js";

// Mock external utilities
vi.mock("@1771technologies/lytenyte-dom-utils", () => ({
  getRootNode: vi.fn(),
  isNodeAttached: vi.fn(),
  isZeroArea: vi.fn(),
  matches: vi.fn(),
}));

const { getRootNode, isNodeAttached, isZeroArea, matches } = await import(
  "@1771technologies/lytenyte-dom-utils"
);

beforeEach(() => {
  vi.restoreAllMocks();
  (matches as Mock).mockReturnValue(false);
  (isZeroArea as Mock).mockReturnValue(false);
  (isNodeAttached as Mock).mockReturnValue(true);
});

function createTestElement(styles: Partial<CSSStyleDeclaration> = {}) {
  const el = document.createElement("div");
  document.body.appendChild(el);

  // @ts-expect-error override
  window.getComputedStyle = () => ({
    visibility: "visible",
    ...styles,
  });
  return el;
}

test("isHidden: returns true if visibility is hidden", () => {
  const el = createTestElement({ visibility: "hidden" });

  const result = isHidden(el, { displayCheck: "full", getShadowRoot: true });
  expect(result).toBe(true);
});

test("isHidden: returns true if element is inside a closed <details>", () => {
  const el = createTestElement();

  (matches as Mock).mockImplementation((_, sel) => {
    if (sel === "details>summary:first-of-type") return false;
    if (sel === "details:not([open]) *") return true;
    return false;
  });

  const result = isHidden(el, { displayCheck: "full", getShadowRoot: true });
  expect(result).toBe(false);
});

test("isHidden: returns true if isNodeAttached but no client rects", () => {
  const el = createTestElement();
  (el as any).getClientRects = () => [];

  const result = isHidden(el, { displayCheck: "full", getShadowRoot: true });
  expect(result).toBe(true);
});

test("isHidden: returns false if client rects exist and node is attached", () => {
  const el = createTestElement();
  (el as any).getClientRects = () => [{ width: 100, height: 20 }];

  const result = isHidden(el, { displayCheck: "full", getShadowRoot: true });
  expect(result).toBe(false);
});

test("isHidden: returns result of isZeroArea if node is in undisclosed shadow", () => {
  const host = document.createElement("div");
  const child = document.createElement("input");
  host.appendChild(child);

  // Simulate a shadow DOM boundary without exposing shadowRoot
  const getShadowRoot = (el: Element) => el === host && true;

  // Return false for inertness, return true from isZeroArea
  (isZeroArea as Mock).mockReturnValue(true);
  (getRootNode as Mock).mockReturnValue(document);

  const result = isHidden(child, { displayCheck: "full", getShadowRoot });
  expect(result).toBe(true);
});

test("isHidden: returns true for detached node with displayCheck = full", () => {
  const el = createTestElement();
  (isNodeAttached as Mock).mockReturnValue(false);

  const result = isHidden(el, { displayCheck: "full", getShadowRoot: true });
  expect(result).toBe(true);
});

test("isHidden: returns false for detached node with displayCheck = legacy-full", () => {
  const el = createTestElement();
  (isNodeAttached as Mock).mockReturnValue(false);

  const result = isHidden(el, { displayCheck: "legacy-full", getShadowRoot: true });
  expect(result).toBe(false);
});

test("isHidden: returns result of isZeroArea when displayCheck is non-zero-area", () => {
  const el = createTestElement();
  (isZeroArea as Mock).mockReturnValue(true);

  const result = isHidden(el, { displayCheck: "non-zero-area", getShadowRoot: true });
  expect(result).toBe(true);
});

test("isHidden: returns false by default (fallback to visible)", () => {
  const el = createTestElement();
  (el as any).getClientRects = () => [{ width: 10 }];

  const result = isHidden(el, { displayCheck: "none", getShadowRoot: false });
  expect(result).toBe(false);
});

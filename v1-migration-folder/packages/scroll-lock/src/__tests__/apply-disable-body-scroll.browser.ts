import { beforeEach, afterEach, expect, test, vi } from "vitest";
import { applyDisableBodyScroll } from "../apply-disable-body-scroll";
import { bslGlobals } from "../+globals.bsl.js";
import type { BodyScrollOptions } from "../+types.bsl.js";
import { handleScroll } from "../handle-scroll";

// Mock dependencies
vi.mock("@1771technologies/lytenyte-dom-utils", () => ({
  isIOS: vi.fn(),
}));

vi.mock("../apply-overflow-hidden", () => ({
  applyOverflowHidden: vi.fn(),
}));

vi.mock("../apply-position-fixed", () => ({
  applyPositionFixed: vi.fn(),
}));

vi.mock("../handle-prevent-default", () => ({
  handlePreventDefault: vi.fn(),
}));

vi.mock("../handle-scroll", () => ({
  handleScroll: vi.fn(),
}));

// Imports after mocks
const { isIOS } = await import("@1771technologies/lytenyte-dom-utils");
const { applyOverflowHidden } = await import("../apply-overflow-hidden");
const { applyPositionFixed } = await import("../apply-position-fixed");
const { handlePreventDefault } = await import("../handle-prevent-default");

beforeEach(() => {
  // Reset globals
  bslGlobals.locks = [];
  bslGlobals.locksIndex = new Map();
  bslGlobals.initialClientY = -1;
  bslGlobals.documentListenerAdded = false;

  // Spy on document event listener
  vi.spyOn(document, "addEventListener");
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("applyDisableBodyScroll: adds lock and calls applyOverflowHidden on non-iOS", () => {
  const el = document.createElement("div");
  const options: BodyScrollOptions = {
    reserveScrollBarGap: true,
  };

  (isIOS as any).mockReturnValue(false);

  applyDisableBodyScroll(el, options);

  expect(bslGlobals.locks).toContainEqual({ targetElement: el, options });
  expect(applyOverflowHidden).toHaveBeenCalledWith(options);
  expect(applyPositionFixed).not.toHaveBeenCalled();
});

test("applyDisableBodyScroll: adds lock and sets touch handlers + calls applyPositionFixed on iOS", () => {
  const el = document.createElement("div");
  (isIOS as any).mockReturnValue(true);

  applyDisableBodyScroll(el);

  expect(bslGlobals.locks).toContainEqual({ targetElement: el, options: {} });
  expect(typeof el.ontouchstart).toBe("function");
  expect(typeof el.ontouchmove).toBe("function");
  expect(applyPositionFixed).toHaveBeenCalled();
  expect(applyOverflowHidden).not.toHaveBeenCalled();
});

test("applyDisableBodyScroll: attaches document-level touchmove listener only once on iOS", () => {
  const el = document.createElement("div");
  (isIOS as any).mockReturnValue(true);
  bslGlobals.documentListenerAdded = false;

  applyDisableBodyScroll(el);

  expect(document.addEventListener).toHaveBeenCalledWith("touchmove", handlePreventDefault, {
    passive: false,
  });
  expect(bslGlobals.documentListenerAdded).toBe(true);

  // Call again — listener should not be added again
  vi.clearAllMocks();
  applyDisableBodyScroll(document.createElement("div"));
  expect(document.addEventListener).not.toHaveBeenCalled();
});

test("applyDisableBodyScroll: does not add duplicate lock if already locked", () => {
  const el = document.createElement("div");
  (isIOS as any).mockReturnValue(false);

  applyDisableBodyScroll(el);
  expect(bslGlobals.locks.length).toBe(1);

  applyDisableBodyScroll(el);
  expect(bslGlobals.locks.length).toBe(1); // No duplicate
});

test("applyDisableBodyScroll: increments locksIndex count per element", () => {
  const el = document.createElement("div");
  (isIOS as any).mockReturnValue(false);

  expect(bslGlobals.locksIndex.get(el)).toBeUndefined();

  applyDisableBodyScroll(el);
  expect(bslGlobals.locksIndex.get(el)).toBe(1);

  applyDisableBodyScroll(el);
  expect(bslGlobals.locksIndex.get(el)).toBe(2);
});

test("applyDisableBodyScroll: ontouchstart handler sets initialClientY on iOS for single touch", () => {
  const el = document.createElement("div");
  (isIOS as any).mockReturnValue(true);

  applyDisableBodyScroll(el);

  const touch = new Touch({
    identifier: 0,
    clientY: 123,
    target: el,
  });

  const ev = new TouchEvent("touchstart", {
    touches: [touch],
    targetTouches: [touch],
    changedTouches: [touch],
    bubbles: true,
    cancelable: true,
  });

  el.ontouchstart?.(ev);
  expect(bslGlobals.initialClientY).toBe(123);
});

test("applyDisableBodyScroll: ontouchmove handler calls handleScroll on iOS for single touch", () => {
  const el = document.createElement("div");
  (isIOS as any).mockReturnValue(true);

  applyDisableBodyScroll(el);

  const touch = new Touch({
    identifier: 0,
    clientY: 150,
    clientX: 50,
    target: el,
  });

  const ev = new TouchEvent("touchmove", {
    touches: [touch],
    targetTouches: [touch],
    changedTouches: [touch],
    bubbles: true,
    cancelable: true,
  });

  el.ontouchmove?.(ev);
  expect(handleScroll).toHaveBeenCalledWith(ev, el);
});

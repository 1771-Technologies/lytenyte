import { beforeEach, afterEach, expect, test, vi, describe } from "vitest";
import { applyEnableBodyScroll } from "../apply-enable-body-scroll";
import { bslGlobals } from "../+globals.bsl.js";

// Mock dependencies
vi.mock("@1771technologies/lytenyte-dom-utils", () => ({
  isIOS: vi.fn(),
}));

vi.mock("../apply-position-setting", () => ({
  applyPositionSetting: vi.fn(),
}));

vi.mock("../apply-restore-overflow", () => ({
  applyRestoreOverflow: vi.fn(),
}));

vi.mock("../handle-prevent-default", () => ({
  handlePreventDefault: vi.fn(),
}));

// Imports after mocks
const { isIOS } = await import("@1771technologies/lytenyte-dom-utils");
const { applyPositionSetting } = await import("../apply-position-setting");
const { applyRestoreOverflow } = await import("../apply-restore-overflow");
const { handlePreventDefault } = await import("../handle-prevent-default");

describe("applyEnableBodyScroll", () => {
  beforeEach(() => {
    bslGlobals.locks = [];
    bslGlobals.locksIndex = new Map();
    bslGlobals.initialClientY = -1;
    bslGlobals.documentListenerAdded = false;

    vi.restoreAllMocks();
    vi.spyOn(document, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("decrements locksIndex and removes lock if index hits zero", () => {
    const el = document.createElement("div");
    bslGlobals.locksIndex.set(el, 1);
    bslGlobals.locks = [{ targetElement: el, options: {} }];

    (isIOS as any).mockReturnValue(false);

    applyEnableBodyScroll(el);

    expect(bslGlobals.locksIndex.has(el)).toBe(false);
    expect(bslGlobals.locks.find((l) => l.targetElement === el)).toBeUndefined();
  });

  test("retains lock if index stays above zero", () => {
    const el = document.createElement("div");
    bslGlobals.locksIndex.set(el, 2);
    bslGlobals.locks = [{ targetElement: el, options: {} }];

    (isIOS as any).mockReturnValue(false);

    applyEnableBodyScroll(el);

    expect(bslGlobals.locksIndex.get(el)).toBe(1);
    expect(bslGlobals.locks.find((l) => l.targetElement === el)).toBeDefined();
  });

  test("clears touch handlers and removes listener on iOS when no locks left", () => {
    const el = document.createElement("div");
    el.ontouchstart = () => {};
    el.ontouchmove = () => {};

    bslGlobals.locks = [{ targetElement: el, options: {} }];
    bslGlobals.locksIndex.set(el, 1);
    bslGlobals.documentListenerAdded = true;

    (isIOS as any).mockReturnValue(true);

    applyEnableBodyScroll(el);

    expect(el.ontouchstart).toBeNull();
    expect(el.ontouchmove).toBeNull();
    expect(document.removeEventListener).toHaveBeenCalledWith("touchmove", handlePreventDefault, {
      passive: false,
    });
    expect(bslGlobals.documentListenerAdded).toBe(false);
  });

  test("calls applyPositionSetting when no locks remain on iOS", () => {
    const el = document.createElement("div");

    bslGlobals.locks = [{ targetElement: el, options: {} }];
    bslGlobals.locksIndex.set(el, 1);
    (isIOS as any).mockReturnValue(true);

    applyEnableBodyScroll(el);

    expect(applyPositionSetting).toHaveBeenCalled();
    expect(applyRestoreOverflow).not.toHaveBeenCalled();
  });

  test("calls applyRestoreOverflow when no locks remain on non-iOS", () => {
    const el = document.createElement("div");

    bslGlobals.locks = [{ targetElement: el, options: {} }];
    bslGlobals.locksIndex.set(el, 1);
    (isIOS as any).mockReturnValue(false);

    applyEnableBodyScroll(el);

    expect(applyRestoreOverflow).toHaveBeenCalled();
    expect(applyPositionSetting).not.toHaveBeenCalled();
  });
});

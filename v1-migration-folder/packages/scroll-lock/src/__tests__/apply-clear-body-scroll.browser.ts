import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { applyClearBodyScroll } from "../apply-clear-body-scroll";
import { bslGlobals } from "../+globals.bsl.js";
import type { Lock, BodyStyleType } from "../+types.bsl.js";

// Mock external dependencies
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

// Get references to mocked functions
const { isIOS } = await import("@1771technologies/lytenyte-dom-utils");
const { applyPositionSetting } = await import("../apply-position-setting");
const { applyRestoreOverflow } = await import("../apply-restore-overflow");
const { handlePreventDefault } = await import("../handle-prevent-default");

describe("applyClearBodyScroll", () => {
  beforeEach(() => {
    // Create dummy elements
    const el1 = document.createElement("div");
    const el2 = document.createElement("div");

    el1.ontouchstart = () => {};
    el1.ontouchmove = () => {};
    el2.ontouchstart = () => {};
    el2.ontouchmove = () => {};

    // Set up mock locks with type-correct structure
    bslGlobals.locks = [
      {
        targetElement: el1,
        options: {
          reserveScrollBarGap: true,
          allowTouchMove: (el) => el === el1,
        },
      },
      {
        targetElement: el2,
        options: {},
      },
    ] satisfies Lock[];

    // Set additional globals
    bslGlobals.initialClientY = 100;
    bslGlobals.previousMarginRight = "12px";
    bslGlobals.previousBodyOverflowSetting = "hidden";
    bslGlobals.htmlStyle = {
      height: "100%",
      overflow: "hidden",
    };
    bslGlobals.bodyStyle = {
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
      overflow: "hidden",
    } satisfies BodyStyleType;
    bslGlobals.documentListenerAdded = true;
    bslGlobals.locksIndex = new Map([
      ["lock1", 0],
      ["lock2", 1],
    ]);

    // Spy on event removal
    vi.spyOn(document, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("(iOS): clears touch handlers and resets listener", () => {
    (isIOS as any).mockReturnValue(true);

    applyClearBodyScroll();

    for (const lock of bslGlobals.locks) {
      expect(lock.targetElement.ontouchstart).toBeNull();
      expect(lock.targetElement.ontouchmove).toBeNull();
    }

    expect(document.removeEventListener).toHaveBeenCalledWith("touchmove", handlePreventDefault, {
      passive: false,
    });

    expect(bslGlobals.initialClientY).toBe(-1);
    expect(bslGlobals.documentListenerAdded).toBe(false);
    expect(applyPositionSetting).toHaveBeenCalled();
    expect(applyRestoreOverflow).not.toHaveBeenCalled();
  });

  test("(non-iOS): calls applyRestoreOverflow only", () => {
    (isIOS as any).mockReturnValue(false);

    applyClearBodyScroll();

    expect(applyRestoreOverflow).toHaveBeenCalled();
    expect(applyPositionSetting).not.toHaveBeenCalled();
    expect(document.removeEventListener).not.toHaveBeenCalled();
  });

  test("always clears locks and locksIndex", () => {
    (isIOS as any).mockReturnValue(false);

    applyClearBodyScroll();

    expect(bslGlobals.locks).toEqual([]);
    expect(bslGlobals.locksIndex.size).toBe(0);
  });
});

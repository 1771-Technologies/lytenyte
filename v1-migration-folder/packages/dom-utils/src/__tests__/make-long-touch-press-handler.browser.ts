import { expect, test, vi, beforeEach, describe } from "vitest";
import { makeLongTouchPressHandler } from "../make-long-touch-press-handler";

describe("makeLongTouchPressHandler", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  // Utility to create a touch event with desired coordinates
  function createTouchEvent(type: string, x: number, y: number): TouchEvent {
    const touch = new Touch({
      identifier: Date.now(),
      target: document.body,
      clientX: x,
      clientY: y,
    });

    const touches = type === "touchend" || type === "touchcancel" ? [] : [touch];

    return new TouchEvent(type, {
      bubbles: true,
      cancelable: true,
      touches,
      targetTouches: touches,
      changedTouches: [touch],
    });
  }

  test("fires callback after long touch", async () => {
    const spy = vi.fn();
    const handler = makeLongTouchPressHandler(spy, 50);

    const startEvent = createTouchEvent("touchstart", 10, 10);
    handler(startEvent);

    expect(spy).not.toHaveBeenCalled();

    await new Promise((r) => setTimeout(r, 70));
    expect(spy).toHaveBeenCalledOnce();
  });

  test("does not fire if touchend happens early", async () => {
    const spy = vi.fn();
    const handler = makeLongTouchPressHandler(spy, 100);

    const startEvent = createTouchEvent("touchstart", 10, 10);
    handler(startEvent);

    const endEvent = createTouchEvent("touchend", 10, 10);
    document.dispatchEvent(endEvent);

    await new Promise((r) => setTimeout(r, 150));
    expect(spy).not.toHaveBeenCalled();
  });

  test("does not fire if touchcancel happens", async () => {
    const spy = vi.fn();
    const handler = makeLongTouchPressHandler(spy, 100);

    const startEvent = createTouchEvent("touchstart", 10, 10);
    handler(startEvent);

    const cancelEvent = createTouchEvent("touchcancel", 10, 10);
    document.dispatchEvent(cancelEvent);

    await new Promise((r) => setTimeout(r, 150));
    expect(spy).not.toHaveBeenCalled();
  });

  test("does not fire if touch moves more than 20px", async () => {
    const spy = vi.fn();
    const handler = makeLongTouchPressHandler(spy, 100);

    const startEvent = createTouchEvent("touchstart", 10, 10);
    handler(startEvent);

    const moveEvent = createTouchEvent("touchmove", 35, 10);
    document.dispatchEvent(moveEvent);

    await new Promise((r) => setTimeout(r, 150));
    expect(spy).not.toHaveBeenCalled();
  });

  test("ignores if multiple touches are detected", async () => {
    const spy = vi.fn();
    const handler = makeLongTouchPressHandler(spy, 50);

    const touch1 = new Touch({ identifier: 1, target: document.body, clientX: 10, clientY: 10 });
    const touch2 = new Touch({ identifier: 2, target: document.body, clientX: 20, clientY: 20 });
    const multiTouchEvent = new TouchEvent("touchstart", {
      bubbles: true,
      cancelable: true,
      touches: [touch1, touch2],
      targetTouches: [touch1, touch2],
      changedTouches: [touch1],
    });

    handler(multiTouchEvent);

    await new Promise((r) => setTimeout(r, 70));
    expect(spy).not.toHaveBeenCalled();
  });
});

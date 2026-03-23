import { beforeEach, describe, expect, test, vi } from "vitest";
import { createAutoscroller, type Autoscroller } from "./create-autoscroller.js";
import { wait } from "../js-utils/sleep.js";

const ACCELERATION = 5;
const MAX_SPEED = 50;

function createScrollableViewport() {
  const viewport = document.createElement("div");
  viewport.style.width = "300px";
  viewport.style.height = "300px";
  viewport.style.overflow = "scroll";
  viewport.style.position = "fixed";
  viewport.style.top = "-9999px";
  viewport.style.left = "-9999px";

  const inner = document.createElement("div");
  inner.style.width = "900px";
  inner.style.height = "900px";

  viewport.appendChild(inner);
  document.body.appendChild(viewport);

  // Start at the midpoint so we can scroll in all four directions
  viewport.scrollLeft = 300;
  viewport.scrollTop = 300;

  return viewport;
}

describe("createAutoscroller", () => {
  let viewport: HTMLElement;
  let onScrolled: () => void;
  let scroller: Autoscroller | null = null;

  beforeEach(() => {
    scroller?.stop();
    scroller = null;
    viewport?.remove();
    viewport = createScrollableViewport();
    onScrolled = vi.fn();
  });

  test("Should not throw when stop is called on a fresh scroller", () => {
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    expect(() => scroller!.stop()).not.toThrow();
  });

  test("Should not throw when stop is called multiple times", () => {
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    expect(() => {
      scroller!.stop();
      scroller!.stop();
      scroller!.stop();
    }).not.toThrow();
  });

  test("Should not scroll when setDirection is called with (0, 0) on a fresh scroller", async () => {
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(0, 0);
    await wait(50);
    expect(Math.floor(viewport.scrollLeft)).toBe(300);
    expect(Math.floor(viewport.scrollTop)).toBe(300);
  });

  test("Should not call onScrolled when direction is (0, 0)", async () => {
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(0, 0);
    await wait(50);
    expect(onScrolled).not.toHaveBeenCalled();
  });

  test("Should scroll right when setDirection(1, 0) is called", async () => {
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(1, 0);
    await vi.waitUntil(() => viewport.scrollLeft > 300, { timeout: 5000 });
  });

  test("Should scroll left when setDirection(-1, 0) is called", async () => {
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(-1, 0);
    await vi.waitUntil(() => viewport.scrollLeft < 300, { timeout: 5000 });
  });

  test("Should scroll down when setDirection(0, 1) is called", async () => {
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(0, 1);
    await vi.waitUntil(() => viewport.scrollTop > 300, { timeout: 5000 });
  });

  test("Should scroll up when setDirection(0, -1) is called", async () => {
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(0, -1);
    await vi.waitUntil(() => viewport.scrollTop < 300, { timeout: 5000 });
  });

  test("Should scroll both axes simultaneously when setDirection(1, 1) is called", async () => {
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(1, 1);
    await vi.waitUntil(() => viewport.scrollLeft > 300 && viewport.scrollTop > 300, { timeout: 5000 });
  });

  test("Should use acceleration as the scroll amount on the first frame", async () => {
    const spy = vi.spyOn(viewport, "scrollBy");
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(1, 0);
    await vi.waitUntil(() => spy.mock.calls.length >= 1, { timeout: 5000 });
    scroller.stop();
    expect(spy.mock.calls[0]).toEqual([ACCELERATION, 0]);
  });

  test("Should increase the scroll amount by acceleration on the second frame", async () => {
    const spy = vi.spyOn(viewport, "scrollBy");
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(1, 0);
    await vi.waitUntil(() => spy.mock.calls.length >= 2, { timeout: 5000 });
    scroller.stop();
    expect(spy.mock.calls[1]).toEqual([ACCELERATION * 2, 0]);
  });

  test("Should cap scroll velocity at maxSpeed and not exceed it", async () => {
    const spy = vi.spyOn(viewport, "scrollBy");
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(1, 0);
    // Frames needed to reach cap: MAX_SPEED / ACCELERATION = 10; wait for a few beyond that
    const framesUntilCap = MAX_SPEED / ACCELERATION;
    await vi.waitUntil(() => spy.mock.calls.length >= framesUntilCap + 3, { timeout: 5000 });
    scroller.stop();
    const callsAfterCap = spy.mock.calls.slice(framesUntilCap);
    for (const call of callsAfterCap) {
      expect(call[0]).toBe(MAX_SPEED);
    }
  });

  test("Should apply acceleration and maxSpeed independently on both axes", async () => {
    const spy = vi.spyOn(viewport, "scrollBy");
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(1, -1);
    await vi.waitUntil(() => spy.mock.calls.length >= 2, { timeout: 5000 });
    scroller.stop();
    expect(spy.mock.calls[0]).toEqual([ACCELERATION, -ACCELERATION]);
    expect(spy.mock.calls[1]).toEqual([ACCELERATION * 2, -ACCELERATION * 2]);
  });

  test("Should stop scrolling when stop() is called", async () => {
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(1, 0);
    await vi.waitUntil(() => viewport.scrollLeft > 300, { timeout: 5000 });
    scroller.stop();
    const positionAfterStop = viewport.scrollLeft;
    await wait(50);
    expect(viewport.scrollLeft).toBe(positionAfterStop);
  });

  test("Should stop scrolling when setDirection(0, 0) is called", async () => {
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(1, 0);
    await vi.waitUntil(() => viewport.scrollLeft > 300, { timeout: 5000 });
    scroller.setDirection(0, 0);
    const positionAfterStop = viewport.scrollLeft;
    await wait(50);
    expect(viewport.scrollLeft).toBe(positionAfterStop);
  });

  test("Should reset velocity after stop so the next start accelerates from zero", async () => {
    const spy = vi.spyOn(viewport, "scrollBy");
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);

    // Build up velocity over several frames then stop
    scroller.setDirection(1, 0);
    await vi.waitUntil(() => spy.mock.calls.length >= 5, { timeout: 5000 });
    scroller.stop();
    spy.mockClear();

    // Restart and verify first frame uses base acceleration, not prior velocity
    scroller.setDirection(1, 0);
    await vi.waitUntil(() => spy.mock.calls.length >= 1, { timeout: 5000 });
    scroller.stop();
    expect(spy.mock.calls[0]).toEqual([ACCELERATION, 0]);
  });

  test("Should not schedule a duplicate frame when setDirection is called with a different non-zero direction while already running", async () => {
    const spy = vi.spyOn(viewport, "scrollBy");
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);

    // Start scrolling right, then change to a different non-zero direction while running.
    // start() will be called again but must detect frame !== null and bail out early
    // rather than scheduling a second concurrent loop.
    scroller.setDirection(1, 0);
    await vi.waitUntil(() => spy.mock.calls.length >= 1, { timeout: 5000 });

    const callsBefore = spy.mock.calls.length;
    scroller.setDirection(0, 1); // different non-zero direction — triggers start() while frame is live
    await wait(50);
    scroller.stop();

    // Each elapsed frame should have produced exactly one scrollBy call, not two
    const callsAdded = spy.mock.calls.length - callsBefore;
    const framesElapsed = Math.round(50 / (1000 / 60)); // ~3 frames in 50ms
    expect(callsAdded).toBeLessThanOrEqual(framesElapsed + 1);
  });

  test("Should not restart the loop when setDirection is called with the same direction", async () => {
    const spy = vi.spyOn(viewport, "scrollBy");
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);

    // Let velocity build up over 3 frames
    scroller.setDirection(1, 0);
    await vi.waitUntil(() => spy.mock.calls.length >= 3, { timeout: 5000 });

    // Calling with the identical direction is a no-op — velocity must not reset
    scroller.setDirection(1, 0);
    await vi.waitUntil(() => spy.mock.calls.length >= 4, { timeout: 5000 });
    scroller.stop();

    // If the loop restarted, frame[3] would be ACCELERATION; it should be >= 4 * ACCELERATION
    expect(spy.mock.calls[3][0]).toBeGreaterThanOrEqual(ACCELERATION * 4);
  });

  test("Should call onScrolled once per frame while scrolling", async () => {
    const spy = vi.spyOn(viewport, "scrollBy");
    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolled);
    scroller.setDirection(1, 0);
    await vi.waitUntil(() => spy.mock.calls.length >= 3, { timeout: 5000 });
    scroller.stop();
    expect(onScrolled).toHaveBeenCalledTimes(spy.mock.calls.length);
  });

  test("Should set frame to null when the loop fires with zero velocity after stop is called inside onScrolled", async () => {
    // When stop() is called during onScrolled, dirX/dirY are zeroed out but the loop has
    // already scheduled the next rAF on line 25. That extra frame fires with zero velocity
    // and must reach the else branch (frame = null) to clean up correctly.
    let hasStopped = false;
    const onScrolledThatStops = vi.fn(() => {
      if (!hasStopped) {
        hasStopped = true;
        scroller!.stop();
      }
    });

    scroller = createAutoscroller(viewport, MAX_SPEED, ACCELERATION, onScrolledThatStops);
    scroller.setDirection(1, 0);

    await vi.waitUntil(() => onScrolledThatStops.mock.calls.length >= 1, { timeout: 5000 });

    // Give the trailing zero-velocity frame time to fire and set frame = null
    await wait(50);

    // No further scrolling should occur
    const positionAfter = viewport.scrollLeft;
    await wait(50);
    expect(viewport.scrollLeft).toBe(positionAfter);
  });
});

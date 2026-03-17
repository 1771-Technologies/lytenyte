import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ScrollLocker } from "./scroll-locker.js";
import { wait } from "../js-utils/sleep.js";

describe("ScrollLocker", () => {
  let locker: ScrollLocker;

  beforeEach(() => {
    locker = new ScrollLocker();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Should lock scroll on acquire and unlock on release", async () => {
    // Covers: line 14 true (lockCount=1, restore=null), line 22 true, line 28 true, line 35 both-false, line 41 both-false
    const release = locker.acquire(document.documentElement);
    await wait();

    expect(locker.restore).not.toBeNull();

    release();
    await wait();

    expect(locker.restore).toBeNull();
    expect(locker.lockCount).toEqual(0);
  });

  test("Should not unlock until all acquires are released", async () => {
    // Covers: line 14 false (lockCount=2, left short-circuits), line 22 false (lockCount=1 after first release)
    const release1 = locker.acquire(document.documentElement);
    const release2 = locker.acquire(document.documentElement);
    await wait();

    expect(locker.lockCount).toEqual(2);

    release1(); // lockCount=1 → line 22: 1===0 is false, no #unlock
    await wait();

    expect(locker.restore).not.toBeNull();

    release2(); // lockCount=0, restore set → line 22 true → #unlock fires
    await wait();

    expect(locker.restore).toBeNull();
    expect(locker.lockCount).toEqual(0);
  });

  test("Should not unlock when re-acquired before unlock fires", async () => {
    // Covers: line 14 false right-side (lockCount=1 but restore≠null during re-acquire),
    //         line 28 false (lockCount=1 when #unlock fires)
    const release1 = locker.acquire(document.documentElement);
    await wait(); // #lock fires, restore is set

    release1(); // lockCount=0, schedules #unlock
    locker.acquire(document.documentElement); // lockCount=1, restore≠null → line 14: true && false → no setTimeout
    await wait(); // #unlock fires: lockCount=1 ≠ 0 → line 28 false → no-op

    expect(locker.restore).not.toBeNull();

    locker.release(); // lockCount=0, schedules #unlock
    await wait();
  });

  test("Should skip lock when released before lock timeout fires", async () => {
    // Covers: line 35 left-true (lockCount<=0), line 22 false (restore=null when release fires)
    const release = locker.acquire(document.documentElement);
    release(); // lockCount=0 before #lock fires; restore=null → line 22: 0===0 && null → false
    await wait(); // #lock fires: lockCount=0 ≤ 0 → early return

    expect(locker.restore).toBeNull();
  });

  test("Should skip lock when restore is already set when lock fires", async () => {
    // Covers: line 35 right-true (restore!==null when #lock fires)
    const existingRestore = vi.fn();
    locker.acquire(document.documentElement); // schedules #lock (lockCount=1, restore=null at this point)
    locker.restore = existingRestore; // set restore before #lock fires
    await wait(); // #lock fires: restore !== null → early return

    expect(locker.restore).toBe(existingRestore);

    locker.lockCount = 0;
    locker.restore = null;
  });

  test("Should set a no-op restore when html overflow is already hidden", async () => {
    // Covers: line 41 left-true (overflowY === "hidden")
    document.documentElement.style.overflowY = "hidden";

    const release = locker.acquire(document.documentElement);
    await wait();

    expect(locker.restore).not.toBeNull();

    release();
    await wait();

    document.documentElement.style.overflowY = "";
  });

  test("Should set a no-op restore when html overflow is clip", async () => {
    // Covers: line 41 right-true (overflowY === "clip")
    document.documentElement.style.overflowY = "clip";

    const release = locker.acquire(document.documentElement);
    await wait();

    expect(locker.restore).not.toBeNull();

    release();
    await wait();

    document.documentElement.style.overflowY = "";
  });

  test("Should use basicPreventScroll on iOS", async () => {
    // Covers: line 46 left-true (isIOS()), line 48 true branch
    // Mock navigator.userAgentData.platform to "iPhone" so isIOS() returns true
    vi.spyOn(navigator as any, "userAgentData", "get").mockReturnValue({
      platform: "iPhone",
      mobile: true,
      brands: [],
    });

    const release = locker.acquire(document.documentElement);
    await wait();

    // basicPreventScroll sets html.style.overflow = "hidden"
    expect(document.documentElement.style.overflow).toEqual("hidden");

    release();
    await wait();
  });

  test("Should use basicPreventScroll when not iOS and no inset scrollbars", async () => {
    // Covers: line 46 left-false right-true (!hasInsetScrollbars), line 48 true branch
    // innerWidth=0 → 0 - clientWidth ≤ 0 → hasInsetScrollbars=false → !hasInsetScrollbars=true
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(0);

    const release = locker.acquire(document.documentElement);
    await wait();

    expect(document.documentElement.style.overflow).toEqual("hidden");

    release();
    await wait();
  });

  test("Should use standardPreventScroll when not iOS and has inset scrollbars", async () => {
    // Covers: line 46 both-false (isIOS=false, hasInsetScrollbars=true), line 48 false branch
    // innerWidth=9999 → 9999 - clientWidth > 0 → hasInsetScrollbars=true → !hasInsetScrollbars=false
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(9999);

    const release = locker.acquire(document.documentElement);
    await wait();

    // standardPreventScroll sets data-ln-scroll-locked
    expect(document.documentElement.getAttribute("data-ln-scroll-locked")).toEqual("");

    release();
    await wait();

    expect(document.documentElement.getAttribute("data-ln-scroll-locked")).toBeNull();
  });
});

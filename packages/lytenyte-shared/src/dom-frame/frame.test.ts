import { describe, expect, test, vi } from "vitest";
import { frame } from "./frame.js";
import { wait } from "../js-utils/index.js";

describe("frame", () => {
  test("Should continue running a function until it returns false", async () => {
    let n = 10;
    const fn = vi.fn();
    const v = () => {
      fn();
      return !!n--;
    };
    frame(v);
    await wait(100);
    await vi.waitUntil(
      () => {
        return n <= 9;
      },
      { timeout: 20_000 },
    );

    frame.cancel(v);
  }, 25_000);

  test("Should run queued functions once per frame and deduplicate concurrent schedules", async () => {
    const fn = vi.fn();
    frame(fn);
    expect(fn).toHaveBeenCalledTimes(0);
    await wait(20);
    expect(fn).toHaveBeenCalledTimes(1);

    frame(fn);
    frame(fn);

    await wait(20);
    expect(fn).toHaveBeenCalledTimes(2);

    frame(fn);
    frame.cancel(fn);

    await wait(20);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test("Should continue running remaining functions when one throws", async () => {
    frame.catch = () => {};
    const fn = vi.fn(() => {
      throw new Error("Run");
    });
    const fn2 = vi.fn();

    frame(fn);
    frame(fn2);
    expect(fn).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);
    await wait(20);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    frame.write(fn);
    frame.onStart(fn);
    await wait(20);
    expect(fn).toHaveBeenCalledTimes(3);

    frame.onFrame(fn);
    frame.onFinish(fn);
    await wait(20);
    expect(fn).toHaveBeenCalledTimes(5);

    frame.setTimeout(fn, 100);
    await wait(120);
    expect(fn).toHaveBeenCalledTimes(6);
    const c = frame.setTimeout(fn, 100);
    c.cancel();
    c.cancel();
    await wait(120);
    expect(fn).toHaveBeenCalledTimes(6);

    frame.catch = console.error;
  });

  test("Should immediately run only the specified function when called in sync mode", () => {
    const fn = vi.fn();
    const fn2 = vi.fn();

    frame(fn);
    frame(fn2);

    expect(fn).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);

    frame.sync(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(0);
  });

  test("Should limit a throttled function to at most one call per frame", async () => {
    const fn = vi.fn();

    const throttled = frame.throttle(fn);

    throttled();
    throttled();
    throttled();
    throttled();

    await wait();
    expect(fn).toBeCalledTimes(1);

    throttled();
    throttled.cancel();

    await wait();
    expect(fn).toBeCalledTimes(1);
  });

  test("Should only run functions when advance is called in demand mode", async () => {
    frame.frameLoop = "demand";

    const fn = vi.fn();
    const fn2 = vi.fn();

    frame(fn);
    frame(fn2);

    expect(fn).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);

    frame.advance();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    frame.frameLoop = "always";
    const original = console.warn;
    const stub = vi.fn();
    console.warn = stub;
    frame.advance();
    console.warn = original;

    expect(stub).toHaveBeenCalledOnce();
  });

  test("Should immediately run functions added to the queue during a sync call", () => {
    const fn = vi.fn();
    let add = true;
    const fn2 = vi.fn(() => {
      if (!add) return;

      add = false;
      frame(fn2);
    });

    frame(fn);
    frame(fn2);

    expect(fn).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);

    frame.sync(fn2);
    expect(fn).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(2);
  });
});

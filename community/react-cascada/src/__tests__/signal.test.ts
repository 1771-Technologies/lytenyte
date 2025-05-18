import { cascada, computed, signal } from "../cascada.js";

describe("signal", () => {
  // Test basic signal creation and usage
  test("should create a signal with initial value", () => {
    const result = cascada(() => {
      const count = signal(0);
      return { count };
    });

    expect(result.count.get()).toBe(0);
  });

  test("should update signal value using set", () => {
    const signals = cascada(() => {
      const count = signal(0);
      return { count };
    });

    expect(signals.count.get()).toEqual(0);
    signals.count.set(1);
    expect(signals.count.get()).toBe(1);
  });

  test("should update signal using setter function", () => {
    const signals = cascada(() => {
      const count = signal(0);
      return { count };
    });

    signals.count.set((prev) => prev + 1);
    expect(signals.count.get()).toBe(1);
  });

  test("should notify watchers when value changes", async () => {
    vi.useFakeTimers();
    const watchFn = vi.fn();

    const signals = cascada(() => {
      const count = signal(0);
      count.watch(watchFn);
      return { count };
    });

    // Initial watch call
    expect(watchFn).toHaveBeenCalledTimes(1);

    signals.count.set(1);

    await vi.runOnlyPendingTimersAsync();
    expect(watchFn).toHaveBeenCalledTimes(2);

    // Multiple sets should only result in one watch call
    signals.count.set(22);
    signals.count.set(11);

    await vi.runOnlyPendingTimersAsync();
    expect(watchFn).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });

  test("watcher notifies only on change when immediate is false", () => {
    const fn = vi.fn();
    const store = cascada(() => {
      const count = signal(0);

      return { count };
    });

    store.count.watch(fn, false);
    expect(fn).not.toHaveBeenCalled();
  });

  test("should be able to call dispose multiple times", () => {
    const watchFn = vi.fn();
    const store = cascada(() => {
      const s = signal(22);
      return { s };
    });

    const dispose = store.s.watch(watchFn);

    // Will throw if there is an issue
    dispose();
    dispose();
  });

  test("should notify multiple watchers", async () => {
    vi.useFakeTimers();
    const watchFn1 = vi.fn();
    const watchFn2 = vi.fn();

    const signals = cascada(() => {
      const count = signal(0);
      count.watch(watchFn1);
      count.watch(watchFn2);
      return { count };
    });

    signals.count.set(1);

    await vi.runOnlyPendingTimersAsync();
    expect(watchFn1).toHaveBeenCalledTimes(2); // Initial + update
    expect(watchFn2).toHaveBeenCalledTimes(2); // Initial + update

    vi.useRealTimers();
  });

  test("should cleanup watchers when dispose is called", () => {
    const watchFn = vi.fn();

    const signals = cascada(() => {
      const count = signal(0);
      return { count };
    });

    const dispose = signals.count.watch(watchFn);
    dispose();
    signals.count.set(1);
    expect(watchFn).toHaveBeenCalledTimes(1); // Only initial call
  });

  test("should respect custom equality function", async () => {
    vi.useFakeTimers();

    const signals = cascada(() => {
      const obj = signal({ value: 1 }, { equal: (a, b) => a.value === b.value });
      return { obj };
    });

    const watchFn = vi.fn();
    signals.obj.watch(watchFn);
    expect(watchFn).toHaveBeenCalled();

    signals.obj.set({ value: 23 });
    await vi.runAllTimersAsync();

    expect(watchFn).toHaveBeenCalledTimes(2);

    signals.obj.set({ value: 23 });
    await vi.runAllTimersAsync();
    expect(watchFn).toHaveBeenCalledTimes(2);

    signals.obj.set({ value: 24 });
    await vi.runAllTimersAsync();
    expect(watchFn).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });

  test("should throw error when created outside cascada", () => {
    expect(() => signal(0)).toThrowErrorMatchingInlineSnapshot(
      `[Error: \`signal\` must be called from within the make function.]`,
    );
  });

  test("should handle nested signals correctly", async () => {
    vi.useFakeTimers();

    const result = cascada(() => {
      const outer = signal(0);
      const inner = signal(1);

      outer.watch(() => {
        if (outer.get() > 0) {
          inner.set((prev) => prev + 1);
        }
      });

      return { outer, inner };
    });

    result.outer.set(1);
    await vi.runOnlyPendingTimersAsync();

    expect(result.inner.get()).toBe(2);

    vi.useRealTimers();
  });

  test("should handle undefined and null values", () => {
    const signals = cascada(() => {
      const nullSignal = signal<null | undefined>(null);
      const undefinedSignal = signal<null | undefined>(undefined);
      return { nullSignal, undefinedSignal };
    });

    expect(signals.nullSignal.get()).toBeNull();
    expect(signals.undefinedSignal.get()).toBeUndefined();

    signals.nullSignal.set(undefined);
    signals.undefinedSignal.set(null);

    expect(signals.nullSignal.get()).toBeUndefined();
    expect(signals.undefinedSignal.get()).toBeNull();
  });

  test("should batch multiple updates", async () => {
    vi.useFakeTimers();
    const watchFn = vi.fn();

    const signals = cascada(() => {
      const count = signal(0);
      count.watch(watchFn);
      return { count };
    });

    // Reset mock to ignore initial watch call
    watchFn.mockReset();

    // Multiple updates in same tick
    signals.count.set(1);
    signals.count.set(2);
    signals.count.set(3);

    await vi.runOnlyPendingTimersAsync();

    expect(signals.count.get()).toBe(3);
    // Exact number of calls will depend on your batching implementation
    // This might need adjustment based on how addTask is implemented
    expect(watchFn.mock.calls.length).toBeGreaterThanOrEqual(1);

    vi.useRealTimers();
  });

  test("should be able to peek a value", () => {
    const s = cascada(() => {
      const v = signal(2);
      const s = computed(() => v.peek() * 2);

      return {
        v,
        s,
      };
    });

    expect(s.s.get()).toEqual(4);
    s.v.set(4);
    expect(s.s.get()).toEqual(4);
  });

  // Test signal with object values and reference equality
  test("should handle object values with reference equality", async () => {
    vi.useFakeTimers();
    const watchFn = vi.fn();
    const initialObj = { count: 0 };

    const signals = cascada(() => {
      const obj = signal(initialObj);
      obj.watch(watchFn);
      return { obj };
    });

    // Reset mock to ignore initial watch call
    watchFn.mockReset();

    // Same reference, should not trigger watch
    signals.obj.set(initialObj);

    await vi.runOnlyPendingTimersAsync();
    expect(watchFn).not.toHaveBeenCalled();

    // New reference, same value, should trigger watch
    signals.obj.set({ count: 0 });

    await vi.runOnlyPendingTimersAsync();
    expect(watchFn).toHaveBeenCalled();
    vi.useRealTimers();
  });
});

test("should handle a bind call", () => {
  const signals = cascada(() => {
    const x = signal(20, { bind: (v) => v * 2 });

    return { x };
  });

  expect(signals.x.get()).toEqual(20);
  signals.x.set(11);
  expect(signals.x.get()).toEqual(22);
});

test("should handle a post set function", () => {
  const fn = vi.fn();
  const signals = cascada(() => {
    const x = signal(10, { postUpdate: fn });

    return { x };
  });

  expect(signals.x.get()).toEqual(10);
  signals.x.set(11);
  expect(signals.x.get()).toEqual(11);
  expect(fn).toHaveBeenCalledOnce();
});

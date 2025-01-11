import { cascada, computed, signal } from "../cascada.js";

test("Should return the correct computed value", () => {
  const s = cascada(() => {
    const x = signal(2);
    const y = signal(3);

    const z = computed(() => x.get() + y.get());

    return { z, x, y };
  });

  expect(s.z.get()).toEqual(5);

  s.x.set(22);
  expect(s.z.get()).toEqual(25);
});

test("Should lazily compute the computed values", () => {
  const fn = vi.fn();
  const { x, z } = cascada(() => {
    const x = signal(2);
    const y = signal(3);
    const z = computed(() => {
      fn();
      return x.get() + y.get();
    });

    return { x, y, z };
  });

  expect(fn).not.toHaveBeenCalled();
  expect(z.get()).toEqual(5);
  expect(fn).toHaveBeenCalledOnce();
  expect(z.get()).toEqual(5);
  expect(fn).toHaveBeenCalledOnce();
  x.set(11);
  expect(z.get()).toEqual(14);
  expect(fn).toHaveBeenCalledTimes(2);
});

test("Should not be active until `get` is called at least once", async () => {
  vi.useFakeTimers();
  const { x, z } = cascada(() => {
    const x = signal(2);
    const z = computed(() => x.get() * 2);

    return { x, z };
  });

  const fn = vi.fn();
  z.watch(fn);
  expect(fn).toHaveBeenCalledOnce();

  x.set(11);
  await vi.runOnlyPendingTimersAsync();

  expect(fn).toHaveBeenCalledOnce();

  expect(z.get()).toEqual(22);
  x.set(10);
  await vi.runOnlyPendingTimersAsync();
  expect(fn).toHaveBeenCalledTimes(2);
});

test("Should be able to peek a computed value", () => {
  const store = cascada(() => {
    const x = signal(4);
    const y = computed(() => x.get() * 2);
    const z = computed(() => y.peek() * 2);

    return { x, y, z };
  });

  expect(store.x.get()).toEqual(4);
  expect(store.y.get()).toEqual(8);
  expect(store.z.get()).toEqual(16);
  store.x.set(8);
  expect(store.x.get()).toEqual(8);
  expect(store.y.get()).toEqual(16);
  expect(store.z.get()).toEqual(16);
});

test("Should be able to call dispose multiple times", () => {
  const { y } = cascada(() => {
    const x = signal(2);
    const y = computed(() => x.get() * 2);

    return { y };
  });

  y.get();
});

test("Should not be able to make a computed value outside of cascada", () => {
  expect(() => computed(() => 23)).toThrowErrorMatchingInlineSnapshot(
    `[Error: \`computed\` must be called from within the make function.]`,
  );
});

test("Should be able to handle computed values within computed values forming a chain", () => {
  const s = cascada(() => {
    const x = signal(10);
    const y = computed(() => x.get() * 2);
    const z = computed(() => y.get() * 2);

    return { x, z };
  });

  expect(s.z.get()).toEqual(40);
  s.x.set(5);
  expect(s.z.get()).toEqual(20);
});

test("Should be able to create a settable signal", () => {
  const s = cascada(() => {
    const x = signal(10);
    const y = computed(
      () => x.get() * 10,
      (v) => x.set(v),
    );

    return { x, y };
  });

  expect(s.y.get()).toEqual(100);
  s.y.set(5);
  expect(s.y.get()).toEqual(50);
  s.y.set((prev) => prev / 2);
  expect(s.y.get()).toEqual(250);
});

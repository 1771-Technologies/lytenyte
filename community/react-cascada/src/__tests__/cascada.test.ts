import { cascada, computed, signal } from "../cascada.js";

test("Should be able to create a store then dispose of it", async () => {
  vi.useFakeTimers();
  const x = cascada(() => {
    const x = signal(10);
    const v = computed(() => x.get() * 2);

    return { x, v };
  });

  expect(x.x.get()).toEqual(10);
  expect(x.v.get()).toEqual(20);

  const fn = vi.fn();
  x.x.watch(fn);
  expect(fn).toHaveBeenCalledOnce();

  x.x.set(20);

  await vi.runOnlyPendingTimersAsync();
  expect(fn).toHaveBeenCalledTimes(2);
  expect(x.x.get()).toEqual(20);
  expect(x.v.get()).toEqual(40);

  vi.useRealTimers();
});

test("Should support nested cascada systems", () => {
  const s = cascada(() => {
    const v = cascada(() => {
      const x = signal(2);
      const y = computed(() => x.get() * 20);

      return { x, y };
    });

    const z = signal(4);
    const r = computed(() => {
      return v.y.get() + z.get();
    });

    return { ...v, r, z };
  });

  expect(s.r.get()).toEqual(44);
  expect(s.y.get()).toEqual(40);

  s.z.set(8);
  expect(s.r.get()).toEqual(48);
  s.x.set(5);
  expect(s.y.get()).toEqual(100);
  expect(s.r.get()).toEqual(108);
});

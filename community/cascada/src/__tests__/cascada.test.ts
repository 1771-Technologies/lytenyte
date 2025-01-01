import { cascada, computed, remote, signal } from "../cascada.js";

test("Should be able to create a store then dispose of it", async () => {
  vi.useFakeTimers();
  const remoteValue = makeRemoveValue().remoteValue;
  const x = cascada(() => {
    const rr = remote(remoteValue);
    const x = signal(10);
    const v = computed(() => rr.get() + x.get());

    return { rr, x, v };
  });

  expect(x.store.rr.get()).toEqual(4);
  expect(x.store.x.get()).toEqual(10);
  expect(x.store.v.get()).toEqual(14);

  const fn = vi.fn();
  x.store.x.watch(fn);
  expect(fn).toHaveBeenCalledOnce();

  x.store.x.set(20);

  await vi.runOnlyPendingTimersAsync();
  expect(fn).toHaveBeenCalledTimes(2);
  expect(x.store.rr.get()).toEqual(4);
  expect(x.store.x.get()).toEqual(20);
  expect(x.store.v.get()).toEqual(24);

  x.store.rr.set(8);

  expect(x.store.rr.get()).toEqual(8);
  expect(x.store.x.get()).toEqual(20);
  expect(x.store.v.get()).toEqual(28);

  x.dispose();

  x.store.x.set(30);
  x.store.rr.set(12);

  await vi.runOnlyPendingTimersAsync();
  expect(fn).toHaveBeenCalledTimes(2);
  expect(x.store.rr.get()).toEqual(8);
  expect(x.store.x.get()).toEqual(30); // x is still set after dispose but other values don't change
  expect(x.store.v.get()).toEqual(28);

  vi.useRealTimers();
});

test("Should be able to make selector", () => {
  const s = cascada(() => {
    const v = signal(2);

    return { v };
  });

  const fn = vi.fn();
  const slice = s.selector((c) => {
    fn();
    return c.v.get() * 2;
  });

  expect(slice.get()).toEqual(4);
  expect(fn).toHaveBeenCalledOnce();
  expect(slice.get()).toEqual(4);
  expect(fn).toHaveBeenCalledOnce();

  s.store.v.set(22);
  expect(slice.get()).toEqual(44);
});

function makeRemoveValue() {
  const subs = new Set<() => void>();
  let value = 4;
  const fn = vi.fn();
  const remoteValue = {
    get: () => {
      fn();
      return value;
    },
    set: (v: number) => {
      value = v;
      subs.forEach((c) => c());
    },

    subscribe: (fn: () => void) => {
      subs.add(fn);

      return () => subs.delete(fn);
    },
  };

  return { remoteValue, fn };
}

test("Should support nested cascada systems", () => {
  const s = cascada(() => {
    const v = cascada(() => {
      const x = signal(2);
      const y = computed(() => x.get() * 20);

      return { x, y };
    });

    const z = signal(4);
    const r = computed(() => {
      return v.store.y.get() + z.get();
    });

    return { ...v.store, r, z };
  });

  expect(s.store.r.get()).toEqual(44);
  expect(s.store.y.get()).toEqual(40);

  s.store.z.set(8);
  expect(s.store.r.get()).toEqual(48);
  s.store.x.set(5);
  expect(s.store.y.get()).toEqual(100);
  expect(s.store.r.get()).toEqual(108);
});

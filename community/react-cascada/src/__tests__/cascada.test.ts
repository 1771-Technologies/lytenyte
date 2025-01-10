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

  expect(x.rr.get()).toEqual(4);
  expect(x.x.get()).toEqual(10);
  expect(x.v.get()).toEqual(14);

  const fn = vi.fn();
  x.x.watch(fn);
  expect(fn).toHaveBeenCalledOnce();

  x.x.set(20);

  await vi.runOnlyPendingTimersAsync();
  expect(fn).toHaveBeenCalledTimes(2);
  expect(x.rr.get()).toEqual(4);
  expect(x.x.get()).toEqual(20);
  expect(x.v.get()).toEqual(24);

  x.rr.set(8);

  expect(x.rr.get()).toEqual(8);
  expect(x.x.get()).toEqual(20);
  expect(x.v.get()).toEqual(28);

  vi.useRealTimers();
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

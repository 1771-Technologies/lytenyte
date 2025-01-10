import { cascada, computed, remote, signal } from "../cascada.js";

test("should be able to handle remote values", () => {
  const subs = new Set<() => void>();
  const value = 44;
  const fn = vi.fn();
  const remoteValue = {
    get: () => {
      fn();
      return value;
    },
    subscribe: (fn: () => void) => {
      subs.add(fn);

      return () => subs.delete(fn);
    },
  };

  const { store: s } = cascada(() => {
    const x = remote(remoteValue);
    return { x };
  });

  expect(s.x.get()).toEqual(44);
  expect(fn).toHaveBeenCalledOnce();
  expect(s.x.get()).toEqual(44);
  expect(fn).toHaveBeenCalledOnce();

  subs.forEach((s) => s());
  expect(s.x.get()).toEqual(44);
  expect(fn).toHaveBeenCalledTimes(2);

  expect(s.x.use()).toEqual(44);
});

test("should be able to handle writable remote values", () => {
  const { remoteValue, fn } = makeRemoteValue();
  const { store: s } = cascada(() => {
    const r = remote(remoteValue);

    return { r };
  });

  expect(s.r.get()).toEqual(4);
  expect(fn).toHaveBeenCalledOnce();

  s.r.set(11);
  expect(s.r.get()).toEqual(11);
  expect(fn).toHaveBeenCalledTimes(2);

  s.r.set((prev) => prev + 1);
  expect(s.r.get()).toEqual(12);
  expect(fn).toHaveBeenCalledTimes(3);

  expect(s.r.use()).toEqual(12);
});

test("should be able to use remote values in a computed calc", () => {
  const { remoteValue } = makeRemoteValue();

  const { store: s } = cascada(() => {
    const x = signal(11);
    const y = remote(remoteValue);
    const z = computed(() => x.get() + y.get());

    return { x, y, z };
  });

  expect(s.z.get()).toEqual(15);
  s.y.set(10);
  expect(s.z.get()).toEqual(21);
});

test("should be able to watch a remote value", async () => {
  vi.useFakeTimers();
  const { remoteValue } = makeRemoteValue();
  const { store: s } = cascada(() => {
    const r = remote(remoteValue);
    return { r };
  });

  expect(s.r.get()).toEqual(4);
  const v = vi.fn();
  s.r.watch(v);
  expect(v).toHaveBeenCalledOnce();

  s.r.set(11);
  await vi.runOnlyPendingTimersAsync();
  expect(v).toHaveBeenCalledTimes(2);

  vi.useRealTimers();
});

test("should not be able to make a remote source outside of cascada", () => {
  const { remoteValue } = makeRemoteValue();
  expect(() => remote(remoteValue)).toThrowErrorMatchingInlineSnapshot(
    `[Error: \`remote\` must be called from within the make function.]`,
  );
});

test("should be able to dispose of remote sources", () => {
  const { remoteValue } = makeRemoteValue();
  const s = cascada(() => {
    const v = remote(remoteValue);
    return { v };
  });

  expect(s.store.v.get()).toEqual(4);
  s.store.v.dispose();
  remoteValue.set(11);
  expect(s.store.v.get()).toEqual(4);
});

test("should be able to peek the remote value", () => {
  const { remoteValue } = makeRemoteValue();
  const s = cascada(() => {
    const v = remote(remoteValue);
    const c = computed(() => v.peek() * 2);

    return { v, c };
  });

  expect(s.store.c.get()).toEqual(8);
  s.store.v.set(8);
  expect(s.store.c.get()).toEqual(8);
});

function makeRemoteValue() {
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

import type { GridApi } from "../../+types";

export const makeEventListeners = <T>() => {
  const events: Record<string, Set<any>> = {};

  return {
    eventAddListener: (name, cb) => {
      events[name] ??= new Set();
      events[name].add(cb);

      return () => events[name].delete(cb);
    },
    eventFire: (name, ...args) => {
      const listeners = events[name];
      if (!listeners) return;

      listeners.forEach((c) => c(...args));
    },
    eventRemoveListener: (name, cb) => {
      events[name]?.delete(cb);
    },
  } satisfies {
    eventAddListener: GridApi<T>["eventAddListener"];
    eventFire: GridApi<T>["eventFire"];
    eventRemoveListener: GridApi<T>["eventRemoveListener"];
  };
};

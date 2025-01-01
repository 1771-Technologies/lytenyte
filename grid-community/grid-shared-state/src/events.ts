import type { ApiEnterprise } from "@1771technologies/grid-types";

export const events = <D, E>() => {
  const events: Record<string, Set<any>> = {};

  return {
    eventAddListeners: (name, cb) => {
      events[name] ??= new Set();
      events[name].add(cb);

      return () => events[name].delete(cb);
    },
    eventFire: (name, ...args) => {
      const listeners = events[name];
      if (!listeners) return;

      listeners.forEach((c) => c(...args));
    },
    eventGetListeners: (name) => {
      return events[name] ?? null;
    },
    eventRemoveListener: (name, cb) => {
      events[name]?.delete(cb);
    },
  } satisfies {
    eventAddListeners: ApiEnterprise<D, E>["eventAddListener"];
    eventFire: ApiEnterprise<D, E>["eventFire"];
    eventGetListeners: ApiEnterprise<D, E>["eventGetListeners"];
    eventRemoveListener: ApiEnterprise<D, E>["eventRemoveListener"];
  };
};

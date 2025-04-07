import type { ApiPro } from "@1771technologies/grid-types/pro";

export const events = <D, E>(): {
  eventAddListeners: ApiPro<D, E>["eventAddListener"];
  eventFire: ApiPro<D, E>["eventFire"];
  eventGetListeners: ApiPro<D, E>["eventGetListeners"];
  eventRemoveListener: ApiPro<D, E>["eventRemoveListener"];
} => {
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
    eventAddListeners: ApiPro<D, E>["eventAddListener"];
    eventFire: ApiPro<D, E>["eventFire"];
    eventGetListeners: ApiPro<D, E>["eventGetListeners"];
    eventRemoveListener: ApiPro<D, E>["eventRemoveListener"];
  };
};

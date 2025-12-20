// https://github.com/oleggrishechkin/react-tagged-state
import { useMemo, useSyncExternalStore } from "react";

export interface Event<T> {
  (nextValue: T): void;
  on: (callback: (value: T) => void) => () => void;
}

export interface Signal<T> {
  (): T;
  (nextValue: T | ((value: T) => T)): T;
  on: (callback: (value: T) => void) => () => void;
}

export interface UseSelector {
  <T>(signal: Signal<T>): T;
  <T, K>(signal: Signal<T>, selector: (value: T) => K): K;
  <T>(selector: () => T): T;
}

const EMPTY = {};

let clock = {};

export const createEvent = <T = void>(): Event<T> => {
  let callbacks: Set<(value: T) => void> | null = null;

  return Object.assign(
    (value: T) => {
      if (callbacks) {
        for (const callback of callbacks) {
          callback(value);
        }
      }
    },
    {
      on: (callback: (value: T) => void) => {
        if (!callbacks) {
          callbacks = new Set();
        }

        callbacks.add(callback);

        return () => {
          if (callbacks) {
            callbacks.delete(callback);

            if (!callbacks.size) {
              callbacks = null;
            }
          }
        };
      },
    },
  );
};

const clockUpdateEvent = createEvent();

export const createSignal = <T>(initialValue: T | (() => T)): Signal<T> => {
  const event = createEvent<T>();
  let value = typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;

  return Object.assign(
    (...args: [] | [nextValue: T | ((value: T) => T)]) => {
      if (args.length) {
        const nextValue = typeof args[0] === "function" ? (args[0] as (value: T) => T)(value) : args[0];

        if (nextValue !== value) {
          value = nextValue;
          event(value);
          clock = {};
          clockUpdateEvent();
        }
      }

      return value;
    },
    { on: event.on },
  ) as Signal<T>;
};

export const useSelector: UseSelector = <T, K>(signal: Signal<T> | (() => T), selector?: (value: T) => K) =>
  useSyncExternalStore(
    "on" in signal ? signal.on : clockUpdateEvent.on,
    useMemo<() => T | K>(() => {
      if ("on" in signal) {
        if (selector) {
          let lastSignalValue: T | typeof EMPTY = EMPTY;
          let value: K;

          return () => {
            const nextSignalValue = signal();

            if (nextSignalValue !== lastSignalValue) {
              lastSignalValue = nextSignalValue;
              value = selector(nextSignalValue);
            }

            return value;
          };
        }

        return signal;
      }

      let lastClock: typeof clock | typeof EMPTY = EMPTY;
      let value: T;

      return () => {
        if (clock !== lastClock) {
          lastClock = clock;
          value = signal();
        }

        return value;
      };
    }, [selector, signal]),
  );

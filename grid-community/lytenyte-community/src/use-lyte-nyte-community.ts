import { makeGridCore } from "@1771technologies/grid-store-community";
import type { GridCoreReact, StateInitCoreReact } from "@1771technologies/grid-types/core-react";
import { useEffect, useState, type ReactNode } from "react";

type ChangeReturnType<F extends (...args: any[]) => any, R> = (...args: Parameters<F>) => R;

type UseLyteNyteCommunityReturn<D> = {
  state: GridCoreReact<D>["state"];
  api: GridCoreReact<D>["api"];
  useSignalWatcher: (c: keyof Omit<GridCoreReact<D>["state"], "internal">, fn: () => void) => void;
  useEvent: ChangeReturnType<GridCoreReact<D>["api"]["eventAddListener"], void>;
};

export const useLyteNyteCommunity = <D>(
  p: StateInitCoreReact<D>,
): UseLyteNyteCommunityReturn<D> => {
  const [grid] = useState(() => {
    const s = makeGridCore<D, ReactNode>(p);

    const useSignalWatcher = (
      c: keyof Omit<GridCoreReact<D>["state"], "internal">,
      fn: () => void,
    ) => {
      const signal = s.state[c];

      useEffect(() => {
        const unsub = signal.watch(fn);

        return () => unsub();
      }, [fn, signal]);
    };

    const useEvent: ChangeReturnType<GridCoreReact<D>["api"]["eventAddListener"], void> = (
      ev,
      fn,
    ) => {
      useEffect(() => {
        const unsub = s.api.eventAddListener(ev, fn);

        return () => unsub();
      }, [ev, fn]);
    };

    return { ...s, useSignalWatcher, useEvent };
  });

  return grid;
};

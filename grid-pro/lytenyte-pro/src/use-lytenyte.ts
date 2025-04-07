import { makeGridPro } from "@1771technologies/grid-store-enterprise";
import { useEffect, useState, type ReactNode } from "react";
import type { GridProReact, StateInitProReact } from "./types";

type ChangeReturnType<F extends (...args: any[]) => any, R> = (...args: Parameters<F>) => R;

type UseLyteNyteCommunityReturn<D> = {
  state: GridProReact<D>["state"];
  api: GridProReact<D>["api"];
  useSignalWatcher: (c: keyof Omit<GridProReact<D>["state"], "internal">, fn: () => void) => void;
  useEvent: ChangeReturnType<GridProReact<D>["api"]["eventAddListener"], void>;
};

export const useLyteNyte = <D>(p: StateInitProReact<D>): UseLyteNyteCommunityReturn<D> => {
  const [grid] = useState(() => {
    const s = makeGridPro<D, ReactNode>(p);

    const useSignalWatcher = (
      c: keyof Omit<GridProReact<D>["state"], "internal">,
      fn: () => void,
    ) => {
      const signal = s.state[c];

      useEffect(() => {
        const unsub = signal.watch(fn);

        return () => unsub();
      }, [fn, signal]);
    };

    const useEvent: ChangeReturnType<GridProReact<D>["api"]["eventAddListener"], void> = (
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

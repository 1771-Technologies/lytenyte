import { makeGridCore } from "@1771technologies/grid-store-core";
import type { GridCoreReact, StateInitCoreReact } from "@1771technologies/grid-types/core-react";
import { useEffect, useState, type ReactNode } from "react";
import { HeaderCellDefault } from "./header/header-cell/header-cell-default";

type ChangeReturnType<F extends (...args: any[]) => any, R> = (...args: Parameters<F>) => R;

type UseLyteNyteCoreReturn<D> = {
  state: GridCoreReact<D>["state"];
  api: GridCoreReact<D>["api"];
  useSignalWatcher: (c: keyof Omit<GridCoreReact<D>["state"], "internal">, fn: () => void) => void;
  useEvent: ChangeReturnType<GridCoreReact<D>["api"]["eventAddListener"], void>;
};

export const useLyteNyteCore = <D>(p: StateInitCoreReact<D>): UseLyteNyteCoreReturn<D> => {
  const [grid] = useState(() => {
    const s = makeGridCore<D, ReactNode>(p);

    // Set the default column header default renderer
    s.state.internal.columnHeaderDefaultRenderer.set(() => HeaderCellDefault);

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

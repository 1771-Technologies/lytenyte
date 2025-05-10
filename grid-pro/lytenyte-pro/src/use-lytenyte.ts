import { makeGridPro } from "@1771technologies/grid-store-pro";
import { useEffect, useState, type ReactNode } from "react";
import type { EventsProReact, GridProReact, StateInitProReact } from "./types";
import { HeaderCellDefault } from "./header-cell/header-cell-default";

type LngEventNames = keyof EventsProReact<any>;

export type UseEvent<D> = <K extends LngEventNames>(
  eventName: K,
  callback: EventsProReact<D>[K],
) => void;

type UseLyteNyteProReturn<D> = {
  state: GridProReact<D>["state"];
  api: GridProReact<D>["api"];
  useSignalWatcher: (c: keyof Omit<GridProReact<D>["state"], "internal">, fn: () => void) => void;
  useEvent: UseEvent<D>;
};

export const useLyteNytePro = <D>(p: StateInitProReact<D>): UseLyteNyteProReturn<D> => {
  const [grid] = useState(() => {
    const s = makeGridPro<D, ReactNode>(p);

    s.state.internal.columnHeaderDefaultRenderer.set(() => HeaderCellDefault);

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

    const useEvent: UseEvent<D> = (ev, fn) => {
      useEffect(() => {
        const unsub = s.api.eventAddListener(ev, fn);

        return () => unsub();
      }, [ev, fn]);
    };

    return { ...s, useSignalWatcher, useEvent };
  });

  return grid;
};

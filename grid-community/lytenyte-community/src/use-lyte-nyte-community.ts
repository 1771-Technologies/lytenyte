import { makeStore } from "@1771technologies/grid-store-community";
import type { PropsCommunityReact, StoreCommunityReact } from "@1771technologies/grid-types";
import { useEffect, useState, type ReactNode } from "react";

type ChangeReturnType<F extends (...args: any[]) => any, R> = (...args: Parameters<F>) => R;

type UseLyteNyteCommunityReturn<D> = {
  state: StoreCommunityReact<D>["state"];
  api: StoreCommunityReact<D>["api"];
  useSignalWatcher: (
    c: keyof Omit<StoreCommunityReact<D>["state"], "internal">,
    fn: () => void,
  ) => void;
  useEvent: ChangeReturnType<StoreCommunityReact<D>["api"]["eventAddListener"], void>;
};

export const useLyteNyteCommunity = <D>(
  p: PropsCommunityReact<D>,
): UseLyteNyteCommunityReturn<D> => {
  const [grid] = useState(() => {
    const s = makeStore<D, ReactNode>(p);

    const useSignalWatcher = (
      c: keyof Omit<StoreCommunityReact<D>["state"], "internal">,
      fn: () => void,
    ) => {
      const signal = s.state[c];

      useEffect(() => {
        const unsub = signal.watch(fn);

        return () => unsub();
      }, [fn, signal]);
    };

    const useEvent: ChangeReturnType<StoreCommunityReact<D>["api"]["eventAddListener"], void> = (
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

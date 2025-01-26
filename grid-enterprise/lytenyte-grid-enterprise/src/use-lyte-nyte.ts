import { makeStore } from "@1771technologies/grid-store-enterprise";
import type { PropsEnterpriseReact, StoreEnterpriseReact } from "@1771technologies/grid-types";
import { useEffect, useState } from "react";

type ChangeReturnType<F extends (...args: any[]) => any, R> = (...args: Parameters<F>) => R;

export const useLyteNyte = <D>(p: PropsEnterpriseReact<D>) => {
  const [grid] = useState(() => {
    const s = makeStore<D>(p);

    const useSignalWatcher = (
      c: keyof Omit<StoreEnterpriseReact<D>["state"], "internal">,
      fn: () => void,
    ) => {
      const signal = s.state[c];

      useEffect(() => {
        const unsub = signal.watch(fn);

        return () => unsub();
      }, [fn, signal]);
    };

    const useEvent: ChangeReturnType<StoreEnterpriseReact<D>["api"]["eventAddListener"], void> = (
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

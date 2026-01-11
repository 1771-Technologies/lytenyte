import { useMemo } from "react";
import type { Events, GridEvents } from "../types/events";

export function useMappedEvents(events: GridEvents[keyof GridEvents], ...args: any) {
  return useMemo(() => {
    return Object.fromEntries(
      Object.entries(events ?? {}).map(([key, ev]) => {
        const evName = `on${key[0].toUpperCase()}${key.slice(1)}`;

        return [evName, (e: any) => ev(e, ...args)];
      }),
    ) as Events;
    // This is technically fine
    // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
  }, [...args, events]);
}

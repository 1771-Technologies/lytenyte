import { useMemo } from "react";
import type { Grid } from "../index.js";

export function useMappedEvents(events: Grid.Events[keyof Grid.Events], params: any) {
  return useMemo(() => {
    return Object.fromEntries(
      Object.entries(events ?? {}).map(([key, ev]) => {
        const evName = `on${key[0].toUpperCase()}${key.slice(1)}`;

        return [evName, (e: any) => ev({ event: e, ...params })];
      }),
    ) as Grid.T.Events;
    // This is technically fine
    // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
  }, [...Object.values(params), events]);
}

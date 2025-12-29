import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useColumnResize(api: Root.API): Root.API["columnResize"] {
  return useEvent((updates) => {
    const columnUpdates = Object.fromEntries(
      Object.entries(updates)
        .map(([c, v]) => [c, { width: v }] as const)
        .filter((c) => api.columnById(c[0])),
    );

    api.columnUpdate(columnUpdates);
  });
}

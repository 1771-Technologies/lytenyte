import type { ColumnView } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useColumnByIndex(view: ColumnView): Root.API["columnByIndex"] {
  return useEvent((i) => {
    return view.visibleColumns[i] ?? null;
  });
}

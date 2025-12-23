import type { ColumnView } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useColumnById(view: ColumnView): Root.API["columnById"] {
  return useEvent((id) => {
    return view.lookup.get(id) ?? null;
  });
}

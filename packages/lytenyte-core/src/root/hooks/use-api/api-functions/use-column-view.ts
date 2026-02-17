import type { ColumnView } from "@1771technologies/lytenyte-shared";
import type { Root } from "../../../root.js";
import { useEvent } from "../../../../hooks/use-event.js";

export function useColumnView(view: ColumnView): Root.API["columnView"] {
  return useEvent(() => {
    return view;
  });
}

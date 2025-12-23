import type { RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root";

export function useRowSelect(props: Root.Props, api: Root.API, source: RowSource): Root.API["rowSelect"] {
  return useEvent(({ selected, deselect = false }) => {
    if (selected === "all") {
      let stop = false;
      const preventDefault = () => (stop = true);
      props.onRowSelect?.({ api, deselect, rows: selected, preventDefault });
      if (stop) return;

      source.onRowsSelected({ selected: "all", deselect, mode: props.rowSelectionMode ?? "none" });

      return;
    }

    let rows: string[];
    if (typeof selected === "string") rows = [selected];
    else if (Array.isArray(selected)) rows = api.rowsBetween(selected[0], selected[1]);
    else rows = [...selected];

    let stop = false;
    const preventDefault = () => (stop = true);
    props.onRowSelect?.({ api, deselect, rows, preventDefault });
    if (stop) return;

    source.onRowsSelected({ selected: rows, deselect, mode: props.rowSelectionMode ?? "none" });
  });
}

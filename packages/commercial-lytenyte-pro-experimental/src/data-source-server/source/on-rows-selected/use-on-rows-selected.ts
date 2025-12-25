import { useEvent, type Signal } from "@1771technologies/lytenyte-core-experimental/internal";
import type { RowSourceServer } from "../../use-server-data-source";
import type { SourceState } from "../use-source-state";
import { exemptUpwards } from "./exempt-upwards.js";
import type { ServerData } from "../../server-data";
import { handleIsolatedSelect } from "./handle-isolated-select.js";
import { collapseUpwards } from "./collapse-upward.js";
import {
  type RowSelectionLinkedWithParent,
  type RowSelectNodeWithParent,
} from "@1771technologies/lytenyte-shared";

export function useOnRowsSelected<T>(
  source: ServerData,
  s: SourceState,
  rowParents: RowSourceServer<T>["rowParents"],
  isolatedSelected: boolean,
  globalSignal: Signal<number>,
) {
  const onRowsSelected: RowSourceServer<T>["onRowsSelected"] = useEvent(({ mode, selected, deselect }) => {
    if (selected === "all" && mode === "single") {
      console.error("You cannot select all rows when the selection mode is 'single'");
      return;
    }
    if (mode === "none") {
      console.error("You cannot select a row when the selection mode is 'none'");
      return;
    }

    if (mode === "single") {
      s.setSelected({ kind: "isolated", selected: false, exceptions: new Set([selected[0]]) });
    } else if (mode === "multiple" && isolatedSelected) {
      // We are either selecting or deselecting everything.
      if (selected === "all") s.setSelected({ kind: "isolated", selected: !deselect, exceptions: new Set() });
      else s.setSelected((prev) => handleIsolatedSelect(prev, selected, !!deselect));
    } else {
      // mode === multiple && !isolatedSelected
      if (selected === "all") {
        s.setSelected({ kind: "controlled", selected: !deselect, children: new Map() });
      } else {
        s.setSelected((prev) => {
          if (prev.kind === "isolated") return { kind: "controlled", selected: false, children: new Map() };

          const rowsWithParents = selected
            .map((id) => rowParents(id).concat(id))
            .sort((l, r) => r.length - l.length);

          const overrides = prev.children;

          for (const path of rowsWithParents) {
            let current: Map<string, RowSelectNodeWithParent> = overrides;

            let pathValue = prev.selected;

            let next: RowSelectNodeWithParent | RowSelectionLinkedWithParent = prev;
            for (let i = 0; i < path.length; i++) {
              const id = path[i];
              if (!current.has(id)) current.set(id, { id, parent: next });
              next = current.get(id)!;

              // We aren't on the last node
              if (i != path.length - 1) {
                next.selected = next.selected ?? pathValue;
                pathValue = next.selected;

                next.children ??= new Map();
                current = next.children;
              } else {
                exemptUpwards(next.id, next, deselect ?? false);

                next.selected = !deselect;
                next.children = undefined;
                next.exceptions = undefined;

                collapseUpwards(next, source, prev.children, prev.selected);
              }
            }
          }

          const state: RowSelectionLinkedWithParent = {
            kind: "controlled",
            selected: prev.selected,
            children: overrides,
          };

          return state;
        });
      }
    }

    globalSignal(Date.now());
  });

  return onRowsSelected;
}

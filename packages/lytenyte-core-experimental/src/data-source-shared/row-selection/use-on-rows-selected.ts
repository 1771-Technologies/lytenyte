import { useEvent, type Signal } from "@1771technologies/lytenyte-core-experimental/internal";
import { exemptUpwards } from "./exempt-upwards.js";
import { handleIsolatedSelect } from "./handle-isolated-select.js";
import { collapseUpwards } from "./collapse-upward.js";
import {
  type RowNode,
  type RowSelectionLinkedWithParent,
  type RowSelectNodeWithParent,
  type RowSource,
} from "@1771technologies/lytenyte-shared";
import type { SourceRowSelection } from "./use-row-selection";

export function useOnRowsSelected<T>(
  s: SourceRowSelection,
  idToSpec: (id: string) => { size: number; children: Map<any, { row: RowNode<any> }> } | null,
  rowParents: RowSource<T>["rowParents"],
  isolatedSelected: boolean,
  globalSignal: Signal<number>,
) {
  const onRowsSelected: RowSource<T>["onRowsSelected"] = useEvent(({ mode, selected, deselect }) => {
    if (selected === "all" && mode === "single") {
      console.error("You cannot select all rows when the selection mode is 'single'");
      return;
    }
    if (mode === "none") {
      console.error("You cannot select a row when the selection mode is 'none'");
      return;
    }

    if (mode === "single") {
      s.rowSelectionsSet({ kind: "isolated", selected: false, exceptions: new Set([selected[0]]) });
    } else if (mode === "multiple" && isolatedSelected) {
      // We are either selecting or deselecting everything.
      if (selected === "all")
        s.rowSelectionsSet({ kind: "isolated", selected: !deselect, exceptions: new Set() });
      else s.rowSelectionsSet((prev) => handleIsolatedSelect(prev, selected, !!deselect));
    } else {
      // mode === multiple && !isolatedSelected
      if (selected === "all") {
        s.rowSelectionsSet({ kind: "controlled", selected: !deselect, children: new Map() });
      } else {
        s.rowSelectionsSet((prev) => {
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

                collapseUpwards(next, idToSpec, prev.children, prev.selected);
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

import { useMemo, type CSSProperties, type ReactNode } from "react";
import { useEvent } from "@1771technologies/lytenyte-core/internal";
import type { RowSelectionLinked } from "@1771technologies/lytenyte-shared";
import type { TreeViewSelectAllParams } from "./types";
import type { API } from "../../types";
import { Checkbox } from "../checkbox/checkbox.js";

export function SelectAll({
  api,
  render,
}: {
  render?: (params: TreeViewSelectAllParams) => ReactNode;
  api: API;
}) {
  const s = api.useSelectionState() as RowSelectionLinked;

  const selected = useMemo(() => {
    const selected = s.selected && s.children.size === 0;
    return selected;
  }, [s]);

  const indeterminate = useMemo(() => {
    return Boolean(s.children.size);
  }, [s]);

  const toggle = useEvent((b?: boolean) => {
    if (b != null) return api.rowSelect({ selected: "all", deselect: !b });

    api.rowSelect({ selected: "all", deselect: selected });
  });

  if (render) return render({ indeterminate, selected, toggle });

  return (
    <div data-ln-tree-view-cell="leaf" style={{ "--ln-row-depth": 0 } as CSSProperties}>
      <Checkbox checked={selected} indeterminate={indeterminate} onClick={() => toggle()} />
      Select All
    </div>
  );
}

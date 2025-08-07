import { useEffect, useMemo, useState } from "react";
import type { Grid, GridAtomReadonlyUnwatchable, RowNode } from "../../+types";
import type { InternalAtoms } from "../../state/+types";
import type { RowMetaData } from "./context";

export function useRowContextValue(
  grid: Grid<any> & { internal: InternalAtoms },
  row: GridAtomReadonlyUnwatchable<RowNode<any> | null>,
) {
  const r = row.useValue();

  const [indeterminate, setIndeterminate] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    function handleSelection() {
      if (!r) return;

      const selectedIds = grid.state.rowSelectedIds.get();

      if (selectedIds.has(r.id)) setSelected(true);
      else setSelected(false);

      if (r.kind === "branch") {
        const childIds = grid.state.rowDataSource.get().rowAllChildIds(r.id);
        setIndeterminate(
          childIds.some((c) => selectedIds.has(c)) && childIds.some((c) => !selectedIds.has(c)),
        );
      } else setIndeterminate(false);
    }

    handleSelection();
    return grid.state.rowSelectedIds.watch(() => handleSelection());
  }, [grid.state.rowDataSource, grid.state.rowSelectedIds, r]);

  const value = useMemo<RowMetaData>(() => {
    return { selected, indeterminate };
  }, [indeterminate, selected]);

  return value;
}

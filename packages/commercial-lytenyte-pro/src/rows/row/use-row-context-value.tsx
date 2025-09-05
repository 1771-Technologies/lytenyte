import { useEffect, useMemo, useState } from "react";
import type { Grid, GridAtomReadonlyUnwatchable, RowNode } from "../../+types";
import type { InternalAtoms } from "../../state/+types";
import type { RowMetaData } from "./context";

export function useRowContextValue(
  grid: Grid<any> & { internal: InternalAtoms },
  row: GridAtomReadonlyUnwatchable<RowNode<any> | null>,
  yPositions: Uint32Array,
) {
  const r = row.useValue();

  const xPositions = grid.state.xPositions.useValue();

  const [indeterminate, setIndeterminate] = useState(false);
  const [selected, setSelected] = useState(false);
  const colBounds = grid.internal.colBounds.useValue();
  const rtl = grid.state.rtl.useValue();
  const base = grid.state.columnBase.useValue();
  const renderers = grid.state.cellRenderers.useValue();

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
    return {
      selected,
      indeterminate,
      colBounds,
      row: r,
      xPositions,
      yPositions,
      rtl,
      base,
      renderers,
    };
  }, [base, colBounds, indeterminate, r, renderers, rtl, selected, xPositions, yPositions]);

  return value;
}

import { useEffect, useReducer, useRef } from "react";
import type { Grid, RowNode } from "../../+types.js";
import type { InternalAtoms } from "../../state/+types.js";

export function useRowSelectionState(
  grid: Grid<any> & { internal: InternalAtoms },
  r: RowNode<any> | null,
) {
  const indeterminateRef = useRef(false);
  const selectedRef = useRef(false);
  const indeterminate = indeterminateRef.current;
  const selected = selectedRef.current;

  const [_, force] = useReducer((p) => p + 1, 0);

  useEffect(() => {
    function handleSelection() {
      if (!r) return;

      const selectedIds = grid.state.rowSelectedIds.get();

      let shouldForce = false;
      if (!selectedRef.current && selectedIds.has(r.id)) {
        selectedRef.current = true;
        shouldForce = true;
      } else if (selectedRef.current && !selectedIds.has(r.id)) {
        selectedRef.current = false;
        shouldForce = true;
      }

      if (r.kind === "branch") {
        const childIds = grid.state.rowDataSource.get().rowAllChildIds(r.id);

        const isIndeterminate =
          childIds.some((c) => selectedIds.has(c)) && childIds.some((c) => !selectedIds.has(c));

        if (!indeterminateRef.current && isIndeterminate) {
          indeterminateRef.current = true;
          shouldForce = true;
        } else if (indeterminateRef.current && !isIndeterminate) {
          indeterminateRef.current = false;
          shouldForce = true;
        }
      } else {
        if (indeterminateRef.current) shouldForce = true;
        indeterminateRef.current = false;
      }

      if (shouldForce) force();
    }

    handleSelection();
    return grid.state.rowSelectedIds.watch(() => handleSelection());
  }, [grid.state.rowDataSource, grid.state.rowSelectedIds, r]);

  return [selected, indeterminate];
}

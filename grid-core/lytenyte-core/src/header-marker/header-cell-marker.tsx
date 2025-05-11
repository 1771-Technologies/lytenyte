import { useMemo } from "react";
import { Checkbox } from "../components/checkbox";
import type { ColumnHeaderRendererParamsCoreReact } from "@1771technologies/grid-types/core-react";

export function HeaderCellMarker({ api }: ColumnHeaderRendererParamsCoreReact<any>) {
  const mode = api.getState().rowSelectionMode.use() === "multiple";
  const supportsSelectedAll = api.rowSelectionSelectAllSupported() && mode;

  const allSelected = api.rowSelectionAllRowsSelected();
  const selected = api.getState().rowSelectionSelectedIds.use();

  const someSelected = useMemo(() => {
    for (const c of selected) {
      if (api.rowById(c)) return true;
    }
    return false;
  }, [api, selected]);

  if (!supportsSelectedAll) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Checkbox
        tabIndex={-1}
        isChecked={allSelected || someSelected}
        isDeterminate={!allSelected && someSelected}
        onClick={() => {
          if (allSelected) api.rowSelectionClear();
          else api.rowSelectionSelectAll();
        }}
      />
    </div>
  );
}

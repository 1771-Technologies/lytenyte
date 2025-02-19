import { t } from "@1771technologies/grid-design";
import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { Checkbox } from "../../components/checkbox";
import { useMemo } from "react";

export function HeaderCellMarker({ api }: ColumnHeaderRendererParamsReact<any>) {
  const supportsSelectedAll = api.rowSelectionSelectAllSupported();

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
      className={css`
        display: flex;
        align-items: center;
        padding-inline-start: ${t.spacing.cell_horizontal_padding};
        width: 100%;
        height: 100%;
      `}
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

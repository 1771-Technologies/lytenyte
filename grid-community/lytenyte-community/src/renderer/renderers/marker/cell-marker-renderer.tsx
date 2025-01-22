import type { CellRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { CollapseButton, ExpandButton } from "../../../components/buttons";
import { useEvent } from "@1771technologies/react-utils";
import { DragButton } from "./drag-button";
import { SelectionCheckbox } from "./selection-checkbox";
import { t } from "@1771technologies/grid-design";

export function CellMarkerRenderer({ row, api }: CellRendererParamsReact<any>) {
  const isRowDetail = api.rowDetailRowPredicate(row.id);
  const isExpanded = api.rowDetailIsExpanded(row.id);
  const isRowDrag = api.rowIsDraggable(row.id);
  const toggleDetail = useEvent(() => api.rowDetailToggle(row.id));

  const rowSelectionEnabled = api.getState().rowSelectionMode.use() !== "none";

  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        padding-inline-start: ${t.spacing.cell_horizontal_padding};
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: relative;
      `}
    >
      {rowSelectionEnabled && <SelectionCheckbox api={api} row={row} />}
      {isRowDrag && <DragButton api={api} row={row} />}
      {isRowDetail &&
        (isExpanded ? (
          <CollapseButton onClick={toggleDetail} />
        ) : (
          <ExpandButton onClick={toggleDetail} />
        ))}
    </div>
  );
}

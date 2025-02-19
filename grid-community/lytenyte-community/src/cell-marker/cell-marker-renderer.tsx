import "./cell-marker.css";
import type { CellRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { useEvent } from "@1771technologies/react-utils";
import { DragButton } from "./drag-button";
import { SelectionCheckbox } from "./selection-checkbox";
import { CollapseButton, ExpandButton } from "../components/buttons";

export function CellMarkerRenderer({ row, api }: CellRendererParamsReact<any>) {
  const doesRowHaveDetail = api.rowDetailRowPredicate(row.id);
  const isExpanded = api.rowDetailIsExpanded(row.id);
  const isRowDraggable = api.rowIsDraggable(row.id);
  const toggleDetail = useEvent(() => api.rowDetailToggle(row.id));

  const rowSelectionEnabled = api.getState().rowSelectionMode.use() !== "none";

  return (
    <div className={"lng1771-cell__marker"}>
      {rowSelectionEnabled && <SelectionCheckbox api={api} row={row} />}
      {isRowDraggable && <DragButton api={api} row={row} />}
      {doesRowHaveDetail &&
        (isExpanded ? (
          <CollapseButton onClick={toggleDetail} />
        ) : (
          <ExpandButton onClick={toggleDetail} />
        ))}
    </div>
  );
}

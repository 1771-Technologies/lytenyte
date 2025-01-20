import type { CellRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { CollapseButton, ExpandButton, GridButton } from "../../components/buttons";
import { useEvent } from "@1771technologies/react-utils";
import type { JSX } from "react";
import { useDraggable } from "@1771technologies/react-dragon";
import type { RowNode } from "@1771technologies/grid-types/community";
import { clsx } from "@1771technologies/js-utils";
import { t } from "@1771technologies/grid-design";

export function CellMarkerRenderer({ row, api }: CellRendererParamsReact<any>) {
  const isRowDetail = api.rowDetailRowPredicate(row.id);
  const isExpanded = api.rowDetailIsExpanded(row.id);
  const isRowDrag = api.rowIsDraggable(row.id);

  const toggleDetail = useEvent(() => api.rowDetailToggle(row.id));

  const draggable = useDraggable({
    dragData: () => ({ row }),
    dragTags: () => {
      const sx = api.getState();
      const id = sx.gridId.peek();
      const externalGrids = sx.rowDragExternalGrids.peek();
      const externalIds = externalGrids.map((c) => c.getState().gridId.peek());

      return [id, ...externalIds].map((c) => `${c}:row-drag`);
    },
    placeholder: () => <DragPlaceholder row={row} />,
  });

  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: relative;
      `}
    >
      {isRowDrag && (
        <GridButton {...draggable}>
          <DragDots width={10} height={10} />
        </GridButton>
      )}
      {isRowDetail &&
        (isExpanded ? (
          <CollapseButton onClick={toggleDetail} />
        ) : (
          <ExpandButton onClick={toggleDetail} />
        ))}
    </div>
  );
}

export const DragDots = (p: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="currentcolor" {...p}>
      <circle cx="1.75" cy="1.7146" r="1.25" />
      <circle cx="1.75" cy="6.2146" r="1.25" />
      <circle cx="1.75" cy="10.7146" r="1.25" />
      <circle cx="6.25" cy="1.7146" r="1.25" />
      <circle cx="6.25" cy="6.2146" r="1.25" />
      <circle cx="6.25" cy="10.7146" r="1.25" />
    </svg>
  );
};

export const DragPlaceholder = (p: { row: RowNode }) => {
  return (
    <div
      className={clsx(css`
        padding-inline: ${t.spacing.cell_horizontal_padding};
        padding-block: ${t.spacing.cell_vertical_padding};
        border: 1px solid ${t.colors.primary_50};
        background-color: ${t.colors.backgrounds_default};
        border-radius: ${t.spacing.box_radius_regular};
      `)}
    >
      Moving row {p.row.rowIndex}
    </div>
  );
};

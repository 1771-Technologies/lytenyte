import type { CellRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { CollapseButton, ExpandButton } from "../../components/buttons";
import { useEvent } from "@1771technologies/react-utils";

export function CellMarkerRenderer({ row, api }: CellRendererParamsReact<any>) {
  const isRowDetail = api.rowDetailRowPredicate(row.id);
  const isExpanded = api.rowDetailIsExpanded(row.id);

  const toggleDetail = useEvent(() => api.rowDetailToggle(row.id));

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
      {isRowDetail &&
        (isExpanded ? (
          <CollapseButton onClick={toggleDetail} />
        ) : (
          <ExpandButton onClick={toggleDetail} />
        ))}
    </div>
  );
}

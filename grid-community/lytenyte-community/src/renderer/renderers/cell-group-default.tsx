import type { CellRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { GridButton } from "../../components/buttons";
import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import { cellCls } from "./cell-renderer-default";

export function CellGroupRendererDefault({ api, row, column }: CellRendererParamsReact<any>) {
  if (!api.rowIsGroup(row)) {
    return <div></div>;
  }

  const key = row.pathKey;

  const displayMode = api.getState().rowGroupDisplayMode.peek();
  if (displayMode === "custom") return null;

  const isMulti = displayMode === "multi-column";

  const rowDepth = api.rowDepth(row.rowIndex!);
  const depth = isMulti ? 0 : rowDepth;
  const columnDepth = Number.parseInt(column.id.split(":").pop()!);

  if (isMulti && columnDepth !== rowDepth) {
    return <div className={cellCls} />;
  }

  return (
    <div
      style={{ paddingInlineStart: depth * 24 + 4 }}
      className={clsx(
        cellCls,
        css`
          gap: ${t.spacing.space_02};
        `,
      )}
    >
      <GridButton
        onClick={() => api.rowGroupToggle(row)}
        className={clsx(
          css`
            width: 20px;
            height: 20px;
          `,
          row.expanded &&
            css`
              transform: rotate(90deg);
            `,
        )}
      >
        ›
      </GridButton>
      {key}
    </div>
  );
}

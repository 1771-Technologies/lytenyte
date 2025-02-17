import type { CellRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { GridButton } from "../../components/buttons";
import { clsx } from "@1771technologies/js-utils";

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
    return <div className={css``} />;
  }

  return (
    <div
      style={{ paddingInlineStart: depth * 24 + 4 }}
      className={clsx(css`
        white-space: nowrap;
        display: grid;
        align-items: center;
        grid-template-columns: 24px 1fr;
      `)}
    >
      <GridButton
        onClick={() => api.rowGroupToggle(row)}
        className={clsx(
          css`
            width: 20px;
            height: 20px;
          `,
          api.rowGroupIsExpanded(row) &&
            css`
              transform: rotate(90deg);
            `,
        )}
      >
        ›
      </GridButton>
      <div
        className={css`
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        `}
      >
        {key}
      </div>
    </div>
  );
}

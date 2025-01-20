import type { CellRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { GridButton } from "../../components/buttons";
import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";

export function CellGroupRendererDefault({ api, row }: CellRendererParamsReact<any>) {
  if (!api.rowIsGroup(row)) {
    return <div></div>;
  }

  const key = row.pathKey;
  const depth = api.rowDepth(row.rowIndex!);

  return (
    <div
      style={{ paddingInlineStart: depth * 24 + 16 }}
      className={css`
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        gap: ${t.spacing.space_02};
      `}
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

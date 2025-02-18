import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { clsx } from "@1771technologies/js-utils";

export function HeaderCellDefault({ column }: ColumnHeaderRendererParamsReact<any>) {
  const label = column.headerName ?? column.id;

  return (
    <div
      className={clsx(css`
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
      `)}
    >
      {label}
    </div>
  );
}

import type { CellRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { clsx } from "@1771technologies/js-utils";

export const cellCls = css`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export function CellRendererDefault({ api, row, column }: CellRendererParamsReact<any>) {
  const sx = api.getState();

  const base = sx.columnBase.peek();

  const textAlign =
    column.cellJustify ?? base.cellJustify ?? (column.type === "number" ? "end" : "start");

  const field = api.columnField(row, column);

  return (
    <div className={clsx(cellCls)} style={{}}>
      <div
        style={{
          textAlign,
        }}
        className={css`
          width: 100%;
          text-overflow: ellipsis;
          text-align: start;
          overflow: hidden;
        `}
      >
        {String(field ?? "")}
      </div>
    </div>
  );
}

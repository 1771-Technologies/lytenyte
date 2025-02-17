import type { CellRendererParamsReact } from "@1771technologies/grid-types/community-react";

export function CellRendererDefault({ api, row, column }: CellRendererParamsReact<any>) {
  const sx = api.getState();

  const base = sx.columnBase.peek();

  const textAlign =
    column.cellJustify ?? base.cellJustify ?? (column.type === "number" ? "end" : "start");

  const field = api.columnField(row, column);

  return (
    <div
      style={{
        textAlign,
      }}
      className={css`
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding-inline: 12px;
        text-align: start;
        overflow: hidden;
      `}
    >
      <span
        className={css`
          width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        `}
      >
        {String(field ?? "")}
      </span>
    </div>
  );
}

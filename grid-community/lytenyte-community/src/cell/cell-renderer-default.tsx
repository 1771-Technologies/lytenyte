import type { CellRendererParamsReact } from "@1771technologies/grid-types/community-react";

export function CellRendererDefault({ api, row, column }: CellRendererParamsReact<any>) {
  const field = api.columnField(row, column);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        paddingInline: 12,
        overflow: "hidden",
      }}
    >
      <span
        style={{
          width: "100%",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {String(field ?? "")}
      </span>
    </div>
  );
}

import type { ColumnHeaderRendererParamsCoreReact } from "@1771technologies/grid-types/core-react";

export function HeaderCellDefault({ column }: ColumnHeaderRendererParamsCoreReact<any>) {
  const label = column.headerName ?? column.id;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
        paddingInline: 12,
      }}
    >
      {label}
    </div>
  );
}

import type { CellRendererParamsReact } from "@1771technologies/grid-types/core-react";
import { GridButton } from "../components/buttons";

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
    return <div />;
  }

  return (
    <div
      style={{
        paddingInlineStart: depth * 24 + 4,
        whiteSpace: "nowrap",
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: "24px 1fr",
        height: "100%",
      }}
    >
      <GridButton
        onClick={() => api.rowGroupToggle(row)}
        style={{
          width: 20,
          height: 20,
          transform: api.rowGroupIsExpanded(row) ? "rotate(90deg)" : undefined,
        }}
      >
        ›
      </GridButton>
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {key}
      </div>
    </div>
  );
}

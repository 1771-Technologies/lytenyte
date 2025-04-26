import type { CellRendererParamsCoreReact } from "@1771technologies/grid-types/core-react";
import { GridButton } from "../components/buttons";
import LoadingSpinner from "./loading-spinner";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export function CellGroupRendererDefault({ api, row, column }: CellRendererParamsCoreReact<any>) {
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

  const isLoading = !!row.loading;

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
      {!isLoading && !row.error && (
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
      )}
      {row.error && !isLoading && (
        <GridButton
          onClick={() => (api as unknown as ApiPro<any, any>).rowReloadExpansion?.(row)}
          style={{
            width: 20,
            height: 20,
            color: "red",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            width={20}
            height={20}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </GridButton>
      )}
      {isLoading && <LoadingSpinner />}
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

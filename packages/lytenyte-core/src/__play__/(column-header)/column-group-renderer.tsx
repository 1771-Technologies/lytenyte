import type { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import type { Grid } from "../..";

interface Spec {
  readonly data: (typeof bankDataSmall)[number];
}

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function ColumnGroupRenderer({
  api,
  collapsible,
  collapsed,
  groupPath,
}: Grid.T.HeaderGroupParams<Spec>) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "6px",
        width: "100%",
        height: "100%",
        padding: "0 8px",
        boxSizing: "border-box",
        fontWeight: 600,
        fontSize: "12px",
        overflow: "hidden",
      }}
    >
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {groupPath.at(-1)}
      </span>

      {collapsible && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            api.columnToggleGroup(groupPath);
          }}
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            padding: 0,
            border: "1px solid currentColor",
            borderRadius: "4px",
            background: "transparent",
            cursor: "pointer",
            opacity: 0.7,
          }}
          title={collapsed ? "Expand group" : "Collapse group"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      )}
    </div>
  );
}

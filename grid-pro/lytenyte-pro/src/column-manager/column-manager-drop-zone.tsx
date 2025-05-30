import { clsx } from "@1771technologies/js-utils";
import { forwardRef, useMemo, type JSX, type ReactNode } from "react";
import type { PillManagerPillItem } from "../pill-manager/pill-manager-types";
import { useDragBox } from "./column-manager-drag-box";
import { useCombinedRefs } from "@1771technologies/react-utils";
import { useDroppable } from "@1771technologies/lytenyte-core/internal";
import { DragGroupIcon } from "../icons";
import { useGrid } from "../use-grid";

export interface ColumnManagerDropZoneProps {
  children: (p: { pills: PillManagerPillItem[] }) => ReactNode;
  empty?: ReactNode;
}

export const ColumnManagerDropZoneVisibility = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"]
>(function ColumnManagerDropZoneVisibility(props, ref) {
  const { pillSource } = useDragBox();
  const { state: sx } = useGrid();

  const key =
    pillSource === "row-groups"
      ? "rowGroups"
      : pillSource === "aggregations"
        ? "values"
        : pillSource === "column-pivots"
          ? "columnPivots"
          : "measures";
  const expansions = sx.internal.columnManagerBoxExpansions.use();
  const expanded = expansions[key];

  if (!expanded) return null;

  return <div {...props} ref={ref} />;
});

export const ColumnManagerDropZone = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "children"> & ColumnManagerDropZoneProps
>(function ColumnManagerDropZone({ className, children, ...props }, ref) {
  const { pillSource, dropTags, dropData } = useDragBox();

  const {
    canDrop,
    isTarget,
    isNearestOver,
    ref: dropRef,
  } = useDroppable({
    id: `${pillSource}-pills`,
    accepted: dropTags,
    data: dropData,
  });

  const combined = useCombinedRefs(dropRef, ref);

  return (
    <div
      {...props}
      className={clsx("lng1771-column-manager__drop-zone", className)}
      data-is-drop-target={isTarget}
      ref={combined}
      data-pill-source={pillSource}
      data-drop-visible={canDrop && dropData.sourceItems.filter((c) => c.active).length === 0}
      tabIndex={-1}
    >
      {children({ pills: dropData.sourceItems })}
      {dropData.sourceItems.length === 0 && <EmtpyDefault source={pillSource} />}

      {canDrop && isNearestOver && dropData.sourceItems.filter((c) => c.active).length > 0 && (
        <div className="lng1771-column-manager__drop-zone-indicator" />
      )}
    </div>
  );
});

function EmtpyDefault({ source }: { source: string }) {
  const label = useMemo(() => {
    if (source === "aggregations") return "Drag here to aggregate";
    if (source === "measures") return "Drag here to measure";
    if (source === "column-pivots") return "Drag here to pivot";
    if (source === "row-groups") return "Drag here to group";

    return "";
  }, [source]);

  return (
    <div className="lng1771-column-manager__empty-default-container">
      <div className="lng1771-column-manager__empty-default-icon">
        <DragGroupIcon />
      </div>
      <div className="lng1771-column-manager__empty-default-label">{label}</div>
    </div>
  );
}

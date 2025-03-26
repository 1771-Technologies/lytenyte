import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX, type ReactNode } from "react";
import type { PillManagerPillItem } from "../pill-manager/pill-manager-types";
import { useDragBox } from "./column-manager-drag-box";
import { useCombinedRefs } from "@1771technologies/react-utils";
import { useDroppable } from "@1771technologies/lytenyte-grid-community/internal";

interface ColumnManagerDropZoneProps {
  children: (p: { pills: PillManagerPillItem[] }) => ReactNode;
}

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

      {canDrop && isNearestOver && dropData.sourceItems.filter((c) => c.active).length > 0 && (
        <div className="lng1771-column-manager__drop-indicator-end" />
      )}
    </div>
  );
});

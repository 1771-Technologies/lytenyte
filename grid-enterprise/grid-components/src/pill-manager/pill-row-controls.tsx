import { clsx } from "@1771technologies/js-utils";
import { IconButton } from "../buttons/icon-button";
import { CollapseGroupIcon, ExpandGroupIcon } from "../icons/expand-icon";

export function PillRowControls({
  hasOverflow,
  hasOverflowShadow,
  expanded,
  onExpand,
}: {
  hasOverflow: boolean;
  hasOverflowShadow: boolean;
  onExpand: (b: boolean) => void;
  expanded: boolean;
}) {
  return (
    <div
      className={clsx(
        "lng1771-pill-manager-row-controls",
        hasOverflowShadow && "lng1771-pill-manager-row-controls-have-overflow",
      )}
    >
      <IconButton kind="ghost" disabled={!hasOverflow} onClick={() => onExpand(!expanded)}>
        {expanded ? (
          <CollapseGroupIcon color={hasOverflow ? "var(--lng1771-text-medium)" : undefined} />
        ) : (
          <ExpandGroupIcon color={hasOverflow ? "var(--lng1771-text-medium)" : undefined} />
        )}
      </IconButton>
    </div>
  );
}

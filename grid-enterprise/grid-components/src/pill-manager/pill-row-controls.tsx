import { clsx } from "@1771technologies/js-utils";
import { IconButton } from "../buttons/icon-button";
import { CollapseGroupIcon, ExpandGroupIcon } from "../icons/expand-icon";

export function PillRowControls({
  hasOverflow,
  expanded,
  onExpand,
}: {
  hasOverflow: boolean;
  onExpand: (b: boolean) => void;
  expanded: boolean;
}) {
  return (
    <div
      className={clsx(css`
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--lng1771-backgrounds-ui-panel);
      `)}
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

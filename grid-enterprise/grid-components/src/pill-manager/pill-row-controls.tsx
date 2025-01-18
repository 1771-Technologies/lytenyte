import { clsx } from "@1771technologies/js-utils";
import { CollapseGroupIcon, ExpandGroupIcon } from "../icons/expand-icon";
import { t } from "@1771technologies/grid-design";

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
    <button
      disabled={!hasOverflow}
      onClick={() => onExpand(!expanded)}
      className={clsx(css`
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--lng1771-backgrounds-ui-panel);
        border: none;
        border-inline-start: 1px solid ${t.colors.borders_separator};
        box-sizing: border-box;
        cursor: pointer;

        &:hover:not(:disabled) {
          background-color: ${t.colors.borders_button_light};
        }

        &:disabled {
          cursor: not-allowed;
        }
      `)}
    >
      {expanded ? (
        <CollapseGroupIcon color={hasOverflow ? "var(--lng1771-text-medium)" : undefined} />
      ) : (
        <ExpandGroupIcon color={hasOverflow ? "var(--lng1771-text-medium)" : undefined} />
      )}
    </button>
  );
}

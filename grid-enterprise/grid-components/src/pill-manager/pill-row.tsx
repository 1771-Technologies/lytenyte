import { t } from "@1771technologies/grid-design";
import { useState, type JSX, type ReactNode } from "react";
import { PillRowLabel } from "./pill-row-label";
import { PillRowElements, type PillRowItem } from "./pill-row-elements";
import { PillRowControls } from "./pill-row-controls";
import { Pill } from "../pills/pill";
import { clsx } from "@1771technologies/js-utils";

export interface PillRowProps {
  readonly label: string;
  readonly icon: (props: JSX.IntrinsicElements["svg"]) => ReactNode;
  readonly pillItems: PillRowItem[];
  readonly onPillSelect: (p: PillRowItem) => void;
}

export function PillRow({ label, icon, pillItems, onPillSelect }: PillRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: subgrid;
        grid-column: span 3;
        box-sizing: content-box;
        border-bottom: 1px solid ${t.colors.borders_separator};
      `}
    >
      <PillRowLabel label={label} icon={icon} hasOverflow={hasScroll} />
      <PillRowElements onOverflow={setHasOverflow} expanded={expanded} onScroll={setHasScroll}>
        {pillItems.map((c) => {
          return (
            <div
              role="button"
              tabIndex={-1}
              onClick={() => onPillSelect(c)}
              onKeyDown={(ev) => {
                if (ev.key === "Enter") onPillSelect(c);
              }}
              key={c.id}
              className={clsx(
                c.inactive &&
                  css`
                    opacity: var(--lng1771-opacity-val);
                    transition: opacity ${t.transitions.normal} ${t.transitions.fn};

                    &:hover {
                      opacity: 0.75;
                    }
                  `,
                css`
                  user-select: none;
                  cursor: pointer;
                  padding-inline: ${t.spacing.space_10};
                  padding-block: ${t.spacing.space_10};
                `,
              )}
            >
              <Pill kind={c.kind} label={c.column.headerName ?? c.id} />
            </div>
          );
        })}
      </PillRowElements>
      <PillRowControls
        expanded={expanded}
        onExpand={setExpanded}
        hasOverflow={hasOverflow || expanded}
      />
    </div>
  );
}

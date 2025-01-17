import { t } from "@1771technologies/grid-design";
import { useState, type JSX, type ReactNode } from "react";
import { PillRowLabel } from "./pill-row-label";
import { PillRowElements } from "./pill-row-elements";
import { PillRowControls } from "./pill-row-controls";

export interface PillRowProps {
  readonly label: string;
  readonly icon: (props: JSX.IntrinsicElements["svg"]) => ReactNode;
}

export function PillRow({ label, icon }: PillRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);
  const [atScrollEnd, setAtScrollEnd] = useState(false);

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
      <PillRowElements
        onOverflow={setHasOverflow}
        expanded={expanded}
        onScroll={setHasScroll}
        onScrollEnd={setAtScrollEnd}
      ></PillRowElements>
      <PillRowControls
        expanded={expanded}
        onExpand={setExpanded}
        hasOverflow={hasOverflow || expanded}
        hasOverflowShadow={hasOverflow && !atScrollEnd}
      />
    </div>
  );
}

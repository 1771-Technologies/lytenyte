import { t } from "@1771technologies/grid-design";
import { useState, type JSX, type ReactNode } from "react";
import { PillRowLabel } from "./pill-row-label";
import { PillRowElements, type PillRowItem } from "./pill-row-elements";
import { PillRowControls } from "./pill-row-controls";
import { Pill } from "../pills/pill";
import { clsx } from "@1771technologies/js-utils";
import { DragIcon } from "../icons/drag-icon";
import { IconButton } from "../buttons/icon-button";
import { dragState, useDraggable, useDroppable } from "@1771technologies/react-dragon";

export interface PillRowProps {
  readonly label: string;
  readonly icon: (props: JSX.IntrinsicElements["svg"]) => ReactNode;
  readonly pillItems: PillRowItem[];
  readonly onPillSelect: (p: PillRowItem) => void;
  readonly draggable?: boolean;
  readonly onPillDrop?: (dragged: PillRowItem, dropped: PillRowItem, isBefore: boolean) => void;
}

export function PillRow({
  label,
  icon,
  pillItems,
  onPillSelect,
  onPillDrop,
  draggable,
}: PillRowProps) {
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
        {pillItems.map((c, i) => {
          return (
            <PillItem
              item={c}
              draggable={draggable ?? false}
              onPillSelect={onPillSelect}
              expanded={expanded}
              onPillDrop={onPillDrop}
              key={c.id}
              index={i}
            />
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

function PillItem({
  item: c,
  onPillSelect,
  onPillDrop,
  expanded,
  draggable,
  index,
}: {
  item: PillRowItem;
  index: number;
  onPillSelect: (c: PillRowItem) => void;
  onPillDrop?: (dragged: PillRowItem, dropped: PillRowItem, isBefore: boolean) => void;
  expanded: boolean;
  draggable: boolean;
}) {
  const data = dragState.dragData.use()?.() as { index?: number };
  const isBefore = (data?.index ?? -1) > index;

  const { canDrop, isOver, ...props } = useDroppable({
    tags: [c.dropTag],
    onDrop: (p) => {
      const d = p.getData() as { pillItem: PillRowItem };
      onPillDrop?.(d.pillItem, c, isBefore);
    },
  });

  return (
    <div
      role="button"
      tabIndex={-1}
      onClick={() => onPillSelect(c)}
      onKeyDown={(ev) => {
        if (ev.key === "Enter") onPillSelect(c);
      }}
      {...props}
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

        expanded &&
          css`
            opacity: 0.4;
          `,
        css`
          user-select: none;
          cursor: pointer;
          padding-inline: ${t.spacing.space_10};
          padding-block: ${t.spacing.space_10};
        `,
        isOver &&
          !canDrop &&
          css`
            background-color: ${t.colors.system_red_30};
          `,
        isOver &&
          canDrop &&
          isBefore &&
          css`
            position: relative;
            &::before {
              content: "";
              top: 0px;
              inset-inline-start: 0px;
              position: absolute;
              height: 100%;
              width: 1px;
              background-color: ${t.colors.primary_50};
            }
          `,
        isOver &&
          canDrop &&
          !isBefore &&
          css`
            position: relative;
            &::after {
              content: "";
              top: 0px;
              inset-inline-end: 0px;
              position: absolute;
              height: 100%;
              width: 1px;
              background-color: ${t.colors.primary_50};
            }
          `,
      )}
    >
      <Pill
        kind={c.kind}
        label={c.column.headerName ?? c.id}
        startItem={!c.inactive && draggable && <PillDragger pillItem={c} index={index} />}
      />
    </div>
  );
}

function PillDragger({ pillItem: p, index }: { pillItem: PillRowItem; index: number }) {
  const draggable = useDraggable({
    dragData: () => ({ pillItem: p, index }),
    dragTags: () => [p.dragTag],
    placeholder: () => <Pill kind={p.kind} label={p.column.headerName ?? p.column.id} />,
  });
  return (
    <IconButton tabIndex={-1} small kind="ghost" {...draggable}>
      <DragIcon />
    </IconButton>
  );
}

import { GridBox } from "@1771technologies/lytenyte-pro";
import { type JSX, useState, type PropsWithChildren, type ReactNode } from "react";
import {
  CollapseGroupIcon,
  ColumnsIcon,
  DragDotsSmallIcon,
  ExpandGroupIcon,
} from "@1771technologies/lytenyte-pro/icons";
import type { Grid } from "@1771technologies/lytenyte-pro/types";
import { tw } from "./components";

export function ColumnPills<T>({ grid }: { grid: Grid<T> }) {
  const { rootProps, items } = GridBox.useColumnBoxItems({
    grid,
    draggable: true,
    orientation: "horizontal",

    placeholder: (el) => el.firstElementChild! as HTMLElement,
    onDrop: (p) => {
      if (p.src.id === p.target.id) return;

      grid.api.columnMove({
        moveColumns: [p.src],
        moveTarget: p.target,
        before: p.isBefore,
      });
    },
  });

  return (
    <GridBox.Root {...rootProps}>
      <PillManagerRow icon={<ColumnsIcon />} label="Columns">
        {items.map((c) => {
          return (
            <GridBox.Item
              key={c.id}
              item={c}
              className={tw("flex h-[52px] items-center", "horizontal-indicators")}
              onKeyDown={(e) => {
                if (
                  e.key === " " &&
                  ((e.target as HTMLElement).parentElement as HTMLElement) === e.currentTarget
                ) {
                  grid.api.columnUpdate({
                    [c.data.id]: { hide: !c.data.hide },
                  });
                }
              }}
              itemClassName={tw(
                "h-full flex items-center px-[6px] focus:outline-none group text-ln-gray-90 ",
                "opacity-60 hover:opacity-80 transition-opacity",
                !c.data.hide && "opacity-100 hover:opacity-100",
              )}
            >
              <div
                onClick={(e) => {
                  if (e.currentTarget.contains(e.target as HTMLElement))
                    grid.api.columnUpdate({
                      [c.data.id]: { hide: !c.data.hide },
                    });
                }}
                className="bg-ln-pill-column-fill border-ln-pill-column-stroke group-focus-visible:ring-ln-primary-50 flex h-7 cursor-pointer items-center text-nowrap rounded border pl-1 group-focus-visible:ring-1"
              >
                <DragDotsSmallIcon className="no-drag cursor-grab" />
                <div className="pl-1 pr-3 text-xs">{c.label}</div>
              </div>
            </GridBox.Item>
          );
        })}
      </PillManagerRow>
    </GridBox.Root>
  );
}

export interface PillManagerRowProps {
  readonly icon: ReactNode;
  readonly label: string;
  readonly className?: string;
}
export function PillManagerRow({
  icon,
  label,
  children,
  className,
}: PropsWithChildren<PillManagerRowProps>) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={tw(
        "bg-ln-gray-05 border-ln-gray-20 grid grid-cols-[42px_1fr_64px] border-t md:grid-cols-[151px_1fr_40px]",
      )}
    >
      <div className="text-ln-gray-80 flex min-h-[52px] items-center justify-center gap-2 text-sm md:justify-start md:pl-[30px] md:pr-3">
        {icon}
        <div className="hidden md:block">{label}</div>
      </div>
      <GridBox.Panel
        className={tw(
          "no-scrollbar flex max-h-[200px] w-full items-center overflow-auto focus:outline-none md:max-h-[unset]",
          "focus-visible:outline-ln-primary-50 focus-visible:outline focus-visible:-outline-offset-1",
          expanded && "flex-wrap",
          className,
        )}
      >
        {children}
      </GridBox.Panel>
      <div
        className={tw(
          "border-ln-gray-30 relative flex items-center justify-center gap-1 border-l",
          "before:bg-linear-to-tr before:absolute before:-left-1 before:h-full before:w-1 before:from-transparent before:to-[rgba(0,0,0,0.075)]",
        )}
      >
        <GridIconButton onClick={() => setExpanded((prev) => !prev)} className="h-7 min-w-7">
          {expanded ? (
            <CollapseGroupIcon width={20} height={20} />
          ) : (
            <ExpandGroupIcon width={20} height={20} />
          )}
        </GridIconButton>
      </div>
    </div>
  );
}
export function GridIconButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      className={tw(
        "hover:bg-ln-gray-20 text-ln-gray-70 focus-visible:outline-ln-primary-50 flex size-7 min-h-6 min-w-6 cursor-pointer items-center justify-center rounded transition-colors focus:outline-none focus-visible:outline-1 focus-visible:outline-offset-[-3px]",
        props.className,
      )}
    ></button>
  );
}

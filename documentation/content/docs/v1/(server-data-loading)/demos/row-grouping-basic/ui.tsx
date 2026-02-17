import { GridBox } from "@1771technologies/lytenyte-pro";
import { type PropsWithChildren, type ReactNode } from "react";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { SalaryData } from "./data";
import type { Grid } from "@1771technologies/lytenyte-pro/types";
import { DragDotsSmallIcon } from "@1771technologies/lytenyte-pro/icons";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
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
  return (
    <div
      className={tw(
        "bg-ln-gray-05 border-ln-gray-20 grid grid-cols-[42px_1fr_64px] border-t md:grid-cols-[151px_1fr_118px]",
      )}
    >
      <div className="text-ln-gray-80 flex min-h-[52px] items-center justify-center gap-2 text-sm md:justify-start md:pl-[30px] md:pr-3">
        {icon}
        <div className="hidden md:block">{label}</div>
      </div>
      <GridBox.Panel
        className={tw(
          "no-scrollbar flex max-h-[200px] w-full items-center overflow-auto focus:outline-none md:max-h-[unset]",
          "focus-visible:outline-ln-primary-50 focus-visible:outline-offset-[-1px]",
          className,
        )}
      >
        {children}
      </GridBox.Panel>
    </div>
  );
}
export function GroupPills({ grid }: { grid: Grid<SalaryData> }) {
  const { rootProps, items } = GridBox.useRowGroupBoxItems({
    grid,
    orientation: "horizontal",
    hideColumnOnGroup: true,
    includeGroupables: true,
    placeholder: (el) => el.firstElementChild! as HTMLElement,
  });

  return (
    <GridBox.Root {...rootProps}>
      <PillManagerRow
        icon={<RowGroupIcon />}
        label="Row Groups"
        className="data-[ln-can-drop=true]:bg-ln-primary-10"
      >
        {items.map((c) => {
          const isActive = c.active ?? true;
          return (
            <GridBox.Item
              key={c.id}
              item={c}
              className="horizontal-indicators flex h-[52px] items-center"
              onKeyDown={(ev) => {
                if (ev.key === " ")
                  if (isActive) {
                    c.onDelete(ev.currentTarget);
                  } else {
                    grid.state.rowGroupModel.set((prev) => [...prev, c.id]);
                  }
              }}
              onClick={(e) => {
                if (isActive) {
                  c.onDelete(e.currentTarget);
                } else {
                  grid.state.rowGroupModel.set((prev) => [...prev, c.id]);
                  grid.api.columnUpdate({ [c.id]: { hide: true } });
                }
              }}
              itemClassName={tw(
                "h-full flex items-center px-[6px] focus:outline-none group text-ln-gray-90 ",
                "opacity-60 hover:opacity-80 transition-opacity cursor-pointer",
                isActive && "opacity-100 hover:opacity-100",
              )}
            >
              <div className="bg-ln-pill-group-fill border-ln-pill-group-stroke group-focus-visible:ring-ln-primary-50 flex h-[28px] cursor-pointer items-center text-nowrap rounded border pl-1 group-focus-visible:ring-1">
                {isActive && <DragDotsSmallIcon className="no-drag" />}
                <div className={tw("pl-1 pr-3 text-xs", !isActive && "pr-2")}>{c.label}</div>
              </div>
            </GridBox.Item>
          );
        })}
      </PillManagerRow>
    </GridBox.Root>
  );
}

function RowGroupIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 3.75H17.203"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 9.56055H9.07178"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 15.4688H9"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.8281L14.8284 12.8281L14.8284 9.9997"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.8286 15.6572L14.8286 12.8288L17.657 12.8288"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

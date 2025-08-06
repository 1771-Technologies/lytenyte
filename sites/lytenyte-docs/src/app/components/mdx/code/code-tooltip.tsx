"use client";
import { Tooltip as T } from "@1771technologies/lytenyte-react-components";
import clsx from "clsx";
import { PropsWithChildren, ReactNode, useId } from "react";

export function Tooltip({ trigger, children }: PropsWithChildren<{ trigger: ReactNode }>) {
  const arrowId = useId();
  return (
    <T.Root unmountTime={300} mountTime={300}>
      <T.Trigger className="underline decoration-dashed">{trigger}</T.Trigger>
      <T.Portal>
        <T.Positioner arrow={`#${arrowId}`} side="top">
          <T.Panel
            className={clsx(
              "group z-10 rounded border border-gray-400/40 bg-gray-200 px-4 opacity-0 shadow",
              "transition-opacity data-[ln-tooltip-state='open']:opacity-100",
            )}
          >
            <T.Arrow
              id={arrowId}
              className="arrow"
              arrowClassName="fill-gray-200"
              arrowInnerStrokeClassName="stroke-gray-400/40"
            />
            {children}
          </T.Panel>
        </T.Positioner>
      </T.Portal>
    </T.Root>
  );
}

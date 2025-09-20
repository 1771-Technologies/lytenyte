"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { useContext } from "react";
import { cn } from "../cn";
import { CodeExpandButton } from "./code-expand-button";
import { Context } from "./code-demo-provider";

export function CodeAccordion(props: PropsWithChildren<{ copySlot: ReactNode }>) {
  const c = useContext(Context);

  return (
    <>
      {props.copySlot}
      <div className={cn("relative border-t border-gray-400 dark:border-gray-100")}>
        <div className={cn(!c.showCode && "max-h-[150px] min-h-[100px] overflow-hidden")}>
          {props.children}
        </div>

        <div
          className={cn(
            c.showCode && "flex items-center justify-center bg-gray-200 py-2 dark:bg-gray-50",

            !c.showCode &&
              "absolute bottom-0 flex h-full w-full items-end justify-center bg-[linear-gradient(180deg,#0000,var(--color-gray-200)_97%)] py-2 dark:bg-[linear-gradient(180deg,#0000,var(--color-gray-50)_97%)]",
          )}
        >
          <CodeExpandButton />
        </div>
      </div>
    </>
  );
}

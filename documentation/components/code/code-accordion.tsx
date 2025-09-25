"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { useContext } from "react";
import { cn } from "../cn";
import { Context } from "./code-demo-provider";

export function CodeAccordion(props: PropsWithChildren<{ copySlot: ReactNode }>) {
  const c = useContext(Context);

  return (
    <>
      {props.copySlot}
      <div className={cn("relative")}>
        <div className={cn(!c.showCode && "h-0 overflow-hidden")}>{props.children}</div>
      </div>
    </>
  );
}

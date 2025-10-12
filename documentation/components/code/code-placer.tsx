"use client";
import { useContext, type PropsWithChildren } from "react";
import { Context } from "./code-demo-provider";
import { cn } from "../cn";

export const CodePlacer = (props: PropsWithChildren) => {
  const c = useContext(Context);
  const show = c.showCode;
  return (
    <div
      className={cn(
        "absolute right-[12px] top-[-32px] flex items-center gap-3 md:top-[-34px]",
        show && "top-[-64px]",
      )}
    >
      {props.children}
    </div>
  );
};

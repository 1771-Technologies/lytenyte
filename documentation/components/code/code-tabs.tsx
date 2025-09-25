"use client";

import { Tabs } from "fumadocs-ui/components/tabs";
import { useContext, type PropsWithChildren } from "react";
import { Context } from "./code-demo-provider";
import { cn } from "../cn";

export function CodeTabs({ children, tabs }: PropsWithChildren<{ tabs: string[] }>) {
  const c = useContext(Context);
  return (
    <Tabs
      items={tabs}
      className={cn(
        "bg-fd-card group my-0 rounded-none border-transparent",
        !c.showCode && "button-hider",
      )}
    >
      {children}
    </Tabs>
  );
}

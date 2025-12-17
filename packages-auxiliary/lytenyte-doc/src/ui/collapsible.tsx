"use client";
import { Collapsible as C } from "@base-ui/react";
import { useEffect, useState } from "react";
import { cn } from "./cn.js";

const Collapsible = C.Root;

const CollapsibleTrigger = C.Trigger;

const CollapsibleContent = ({ children, ...props }: C.Panel.Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <C.Panel
      {...props}
      className={cn(
        "overflow-hidden",
        mounted &&
          "data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down",
        props.className,
      )}
    >
      {children}
    </C.Panel>
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

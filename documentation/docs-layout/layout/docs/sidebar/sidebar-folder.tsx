"use client";

import { Collapsible } from "@/docs-layout/ui/collapsible";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { ComponentProps, useMemo, useState } from "react";
import { FolderContext } from "./folder-context";

export function SidebarFolder({
  defaultOpen = false,
  ...props
}: ComponentProps<"div"> & {
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useOnChange(defaultOpen, (v) => {
    if (v) setOpen(v);
  });

  return (
    <Collapsible open={open} onOpenChange={setOpen} {...props}>
      <FolderContext.Provider value={useMemo(() => ({ open, setOpen }), [open])}>
        {props.children}
      </FolderContext.Provider>
    </Collapsible>
  );
}

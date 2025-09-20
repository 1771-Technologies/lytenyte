"use client";

import { Collapsible } from "@/components/ui/collapsible";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import type { ComponentProps } from "react";
import { useMemo, useState } from "react";
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
    <Collapsible open={open} onOpenChange={setOpen} {...props} className="pb-4">
      <FolderContext.Provider value={useMemo(() => ({ open, setOpen }), [open])}>
        {props.children}
      </FolderContext.Provider>
    </Collapsible>
  );
}

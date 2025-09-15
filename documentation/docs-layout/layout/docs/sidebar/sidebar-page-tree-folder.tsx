"use client";
import { PageTree } from "fumadocs-core/server";
import { useInternalContext } from "./internal-context";
import { ReactNode } from "react";
import { useTreePath } from "fumadocs-ui/contexts/tree";
import { SidebarFolder } from "./sidebar-folder";
import { SidebarFolderLink } from "./sidebar-folder-link";
import { SidebarFolderTrigger } from "./sidebar-folder-trigger";
import { SidebarFolderContent } from "./sidebar-folder-content";

export function PageTreeFolder({ item, ...props }: { item: PageTree.Folder; children: ReactNode }) {
  const { defaultOpenLevel, level } = useInternalContext();
  const path = useTreePath();

  return (
    <SidebarFolder
      defaultOpen={(item.defaultOpen ?? defaultOpenLevel >= level) || path.includes(item)}
    >
      {item.index ? (
        <SidebarFolderLink href={item.index.url} external={item.index.external} {...props}>
          {item.icon}
          {item.name}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger {...props}>
          {item.icon}
          {item.name}
        </SidebarFolderTrigger>
      )}
      <SidebarFolderContent>{props.children}</SidebarFolderContent>
    </SidebarFolder>
  );
}

"use client";
import { LinkItemType } from "../../shared";
import { SidebarFolder } from "./sidebar-folder";
import { SidebarFolderContent } from "./sidebar-folder-content";
import { SidebarFolderLink } from "./sidebar-folder-link";
import { SidebarItem } from "./sidebar-item";
import { SidebarFolderTrigger } from "./sidebar-folder-trigger";

export function SidebarLinkItem({
  item,
  ...props
}: {
  item: Exclude<LinkItemType, { type: "icon" }>;
  className?: string;
}) {
  if (item.type === "menu")
    return (
      <SidebarFolder {...props}>
        {item.url ? (
          <SidebarFolderLink href={item.url} external={item.external}>
            {item.icon}
            {item.text}
          </SidebarFolderLink>
        ) : (
          <SidebarFolderTrigger>
            {item.icon}
            {item.text}
          </SidebarFolderTrigger>
        )}
        <SidebarFolderContent>
          {item.items.map((child, i) => (
            <SidebarLinkItem key={i} item={child} />
          ))}
        </SidebarFolderContent>
      </SidebarFolder>
    );

  if (item.type === "custom") return <div {...props}>{item.children}</div>;

  return (
    <SidebarItem href={item.url} icon={item.icon} external={item.external} {...props}>
      {item.text}
    </SidebarItem>
  );
}

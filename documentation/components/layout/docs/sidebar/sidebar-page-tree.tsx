"use client";
import type { PageTree } from "fumadocs-core/server";
import { useTreeContext } from "fumadocs-ui/contexts/tree";
import type { FC, ReactNode } from "react";
import { Fragment, useMemo } from "react";
import { SidebarSeparator } from "./sidebar-separator";
import { SidebarItem } from "./sidebar-item";
import { PageTreeFolder } from "./sidebar-page-tree-folder";
import { cn } from "@/components/cn";
import { ProTag } from "@/components/company/pro-tag";

export interface SidebarComponents {
  Item: FC<{ item: PageTree.Item }>;
  Folder: FC<{ item: PageTree.Folder; level: number; children: ReactNode }>;
  Separator: FC<{ item: PageTree.Separator }>;
}

export function SidebarPageTree(props: { components?: Partial<SidebarComponents> }) {
  const { root } = useTreeContext();

  return useMemo(() => {
    const { Separator, Item, Folder } = props.components ?? {};

    function renderSidebarList(items: PageTree.Node[], level: number): ReactNode[] {
      return items.map((item, i) => {
        if (item.type === "separator") {
          if (Separator) return <Separator key={i} item={item} />;
          return (
            <SidebarSeparator key={i} className={cn(i !== 0 && "mt-6")}>
              {item.icon}
              {item.name}
            </SidebarSeparator>
          );
        }

        if (item.type === "folder") {
          const children = renderSidebarList(item.children, level + 1);

          if (Folder)
            return (
              <Folder key={i} item={item} level={level}>
                {children}
              </Folder>
            );
          return (
            <PageTreeFolder key={i} item={item}>
              {children}
            </PageTreeFolder>
          );
        }

        if (Item) return <Item key={item.url} item={item} />;

        const isPro = proSet.has(item.url);
        return (
          <SidebarItem
            key={item.url}
            href={item.url}
            external={item.external}
            icon={item.icon}
            className="text-[12px] font-semibold tracking-wide"
          >
            {item.name}
            {isPro && (
              <span className="scale-[0.8]">
                <ProTag />
              </span>
            )}
          </SidebarItem>
        );
      });
    }

    return <Fragment key={root.$id}>{renderSidebarList(root.children, 1)}</Fragment>;
  }, [props.components, root]);
}

const proSet = new Set([
  "/docs/server-data-loading-cell-editing",
  "/docs/server-data-loading-handling-load-failures",
  "/docs/server-data-loading-interface",
  "/docs/server-data-loading-optimistic-loading",
  "/docs/server-data-loading-overview",
  "/docs/server-data-loading-push-and-pull",
  "/docs/server-data-loading-row-data",
  "/docs/server-data-loading-row-filtering",
  "/docs/server-data-loading-row-grouping-and-aggregation",
  "/docs/server-data-loading-row-pinning",
  "/docs/server-data-loading-row-sorting",
  "/docs/server-data-loading-row-updating",
  "/docs/server-data-loading-unbalanced-rows",

  "/docs/row-server-data-source",
  "/docs/row-tree-data-source",
  "/docs/cell-selection",
  "/docs/column-pivoting",
  "/docs/filter-in-column-filter",
  "/docs/filter-quick-filter",

  "/docs/component-column-manager",
  "/docs/component-context-menu",
  "/docs/component-dialog-frame",
  "/docs/component-filter-tree",
  "/docs/component-grid-box",
  "/docs/component-popover-frame",
  "/docs/component-sort-manager",

  "/docs/export-clipboard",
]);

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
  "/docs/v1/server-data-loading-cell-editing",
  "/docs/v1/server-data-loading-handling-load-failures",
  "/docs/v1/server-data-loading-interface",
  "/docs/v1/server-data-loading-optimistic-loading",
  "/docs/v1/server-data-loading-overview",
  "/docs/v1/server-data-loading-push-and-pull",
  "/docs/v1/server-data-loading-row-data",
  "/docs/v1/server-data-loading-row-filtering",
  "/docs/v1/server-data-loading-row-grouping-and-aggregation",
  "/docs/v1/server-data-loading-row-pinning",
  "/docs/v1/server-data-loading-row-sorting",
  "/docs/v1/server-data-loading-row-updating",
  "/docs/v1/server-data-loading-unbalanced-rows",
  "/docs/v1/server-data-loading-typescript-reference",

  "/docs/v1/row-server-data-source",
  "/docs/v1/row-tree-data-source",
  "/docs/v1/cell-selection",
  "/docs/v1/column-pivoting",
  "/docs/v1/filter-in-column-filter",
  "/docs/v1/filter-quick-filter",

  "/docs/v1/component-column-manager",
  "/docs/v1/component-context-menu",
  "/docs/v1/component-dialog-frame",
  "/docs/v1/component-filter-tree",
  "/docs/v1/component-grid-box",
  "/docs/v1/component-popover-frame",
  "/docs/v1/component-sort-manager",

  "/docs/v1/export-clipboard",
]);

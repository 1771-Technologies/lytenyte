import type { CSSProperties } from "react";
import { cn } from "../ui/cn.js";
import type { Root } from "./types.js";

interface Props {
  readonly collection: string;
  readonly item: Root["children"][number];
  readonly depth?: number;

  readonly pathname: string;
  readonly titleLookup: Record<string, string>;
}

export function Tree({ item, pathname, titleLookup, collection, depth = 0 }: Props) {
  console.log("I ran");
  if (item?.kind === "direct-link") {
    return <a key={item.id} data-active={pathname === item.id} href={item.id} />;
  }

  if (item?.kind === "external-link") {
    return (
      <a key={item.href} href={item.href}>
        {item.label}
      </a>
    );
  }

  if (item?.kind === "page-link") {
    return (
      <a
        key={item.id}
        data-active={pathname === `/${collection}/${item.id}`}
        href={`/${collection}/${item.id}`}
        className={cn(
          "data-[active=true]:bg-xd-accent-foreground/10 data-[active=true]:text-xd-foreground hover:bg-xd-accent-foreground/5 relative transition-colors",
          "data-active:before:bg-xd-border data-active:before:h-full data-active:before:top-0",
          "data-active:before:absolute data-active:before:w-px data-[active=true]:before:bg-xd-foreground data-[active=true]:before:h-2/5",
          "data-active:before:left-[7px] data-[active=true]:before:top-3/10 duration-100 hover:duration-0",
          "text-xd-muted-foreground text-xs font-semibold tracking-tight",
          "rounded-lg px-[calc(var(--sidebar-depth,1)*16px)] py-2",
        )}
      >
        {titleLookup[item.id]}
      </a>
    );
  }

  if (item?.kind === "separator") {
    return <div role="separator" className="bg-xd-border/30 my-2 h-px w-full" />;
  }

  if (item?.kind === "group") {
    return (
      <div
        className="group"
        data-collapsible={item.collapsible}
        data-collapsed={item.collapsed}
        data-group-id={item.id}
      >
        <div className="flex items-center text-sm font-semibold tracking-tight">
          {!item.collapsible && <div className="flex-1">{item.label}</div>}
          {item.collapsible && (
            <button
              className="xd-collapse-btn hover:bg-xd-accent-foreground/10 -mx-1 flex flex-1 cursor-pointer items-center rounded-lg px-2 py-1 text-start transition-colors"
              data-group-id={item.id}
            >
              <span className="flex-1">{item.label}</span>
              <span className="iconify ph--caret-down transition-transform group-data-[collapsed=true]:-rotate-90" />
            </button>
          )}
        </div>
        <div className="mb-3 mt-1 grid grid-rows-[1fr] overflow-hidden transition-[grid-template-rows] group-data-[collapsible=true]:group-data-[collapsed=true]:grid-rows-[0fr]">
          <div className="min-h-0">
            <div>
              <div className="flex flex-col" style={{ "--sidebar-depth": depth + 1 } as CSSProperties}>
                {item.children!.map((x, i) => (
                  <Tree
                    key={i}
                    item={x}
                    collection={collection}
                    depth={depth + 1}
                    pathname={pathname}
                    titleLookup={titleLookup}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

import type { HTMLAttributes } from "react";
import { Fragment } from "react";
import type { BaseLinkType, LinkItemType } from "../../shared";
import { BaseLinkItem } from "../../shared";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/components/cn";

export function NavbarLinkItem({ item, ...props }: { item: LinkItemType } & HTMLAttributes<HTMLElement>) {
  if (item.type === "menu") {
    return (
      <Popover>
        <PopoverTrigger
          {...props}
          className={cn(
            "has-data-[active=true]:text-fd-primary inline-flex items-center gap-1.5",
            props.className,
          )}
        >
          {item.url ? <BaseLinkItem item={item as BaseLinkType}>{item.text}</BaseLinkItem> : item.text}
          <ChevronDown className="size-3" />
        </PopoverTrigger>
        <PopoverContent className="flex flex-col">
          {item.items.map((child, i) => {
            if (child.type === "custom") return <Fragment key={i}>{child.children}</Fragment>;

            return (
              <BaseLinkItem
                key={i}
                item={child}
                className="hover:bg-fd-accent hover:text-fd-accent-foreground data-[active=true]:text-fd-primary inline-flex items-center gap-2 rounded-md p-2 text-start [&_svg]:size-4"
              >
                {child.icon}
                {child.text}
              </BaseLinkItem>
            );
          })}
        </PopoverContent>
      </Popover>
    );
  }

  if (item.type === "custom") return item.children;

  return (
    <BaseLinkItem item={item} {...props}>
      {item.text}
    </BaseLinkItem>
  );
}

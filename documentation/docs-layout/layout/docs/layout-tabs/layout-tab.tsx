import { cn } from "@/docs-layout/cn";
import { Option } from "@/docs-layout/root-toggle";
import Link from "fumadocs-core/link";

export function LayoutTab({
  option: { title, url, unlisted, props },
  vertical,
  selected = false,
}: {
  option: Option;
  selected?: boolean;
  vertical?: boolean;
}) {
  return (
    <Link
      href={url}
      {...props}
      className={cn(
        !vertical && "border-b-2 pb-1.5",
        vertical && "border-s-2 ps-1.5",
        "inline-flex items-center border-transparent transition-colors",
        "text-fd-muted-foreground hover:text-fd-accent-foreground gap-2 text-nowrap text-sm font-medium",
        unlisted && !selected && "hidden",
        selected && "border-fd-primary text-fd-primary",
        props?.className,
      )}
    >
      {title}
    </Link>
  );
}

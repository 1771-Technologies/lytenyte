import { useMemo } from "react";
import type { Tree } from "./tree.js";
import { cn } from "@/lib/utils.js";
import { Button } from "@/components/ui/button.js";
import { CircuitBoard, Diamond } from "lucide-react";
import type { FrameDemo } from "./iframe-switcher.js";

export function SidebarTree({
  tree,
  onClick,
  depth = 0,
  current,
}: {
  tree: Tree;
  current: FrameDemo | null;
  depth?: number;
  onClick: (v: FrameDemo) => void;
}) {
  const root = useMemo(() => {
    return Object.entries(tree).sort((l, r) => l[0].localeCompare(r[0]));
  }, [tree]);

  return (
    <ul
      className={cn(
        "text-secondary-foreground flex flex-col",
        depth === 0 ? "px-3 py-2" : "border-border border-l",
      )}
    >
      {root.map(([name, value]) => {
        if (value.kind === "leaf")
          return (
            <li style={{ paddingLeft: depth * 16 }} key={name} className="text-sm">
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  "hover:bg-accent w-full justify-start",
                  current?.value === value.path && "bg-accent",
                )}
                onClick={() => {
                  onClick({ label: value.name, path: value.path.split("/"), value: value.path });
                }}
              >
                <Diamond />
                {value.name}
              </Button>
            </li>
          );

        return (
          <li key={name} style={{ paddingLeft: depth * 16 }}>
            <div className="text-muted-foreground flex items-center gap-1 py-1 text-sm">
              <CircuitBoard className="size-5" />
              {value.name}
            </div>

            <SidebarTree
              tree={value.children}
              onClick={onClick}
              depth={depth + 1}
              current={current}
            />
          </li>
        );
      })}
    </ul>
  );
}

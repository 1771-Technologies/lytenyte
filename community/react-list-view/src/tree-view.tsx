import {
  createPathTree,
  type PathTreeInputItem,
  type PathTreeLeafNode,
  type PathTreeParentNode,
} from "@1771technologies/path-tree";
import { Virt, type RendererProps } from "@1771technologies/react-virt";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { ListViewProvider, useListView } from "./list-view-context";

export interface ListViewAxe<D> {
  readonly axeItemLabels: (item: PathTreeLeafNode<D> | PathTreeParentNode<D>) => string;
  readonly axeLabel: (cnt: number) => string;
  readonly axeDescription: string;
}

export interface ListViewItemRendererProps<D> {
  readonly data: PathTreeLeafNode<D> | PathTreeParentNode<D>;
  readonly expanded: boolean;
  readonly parent: boolean;
  readonly depth: number;
}

export interface ListViewProps<D> {
  readonly paths: PathTreeInputItem<D>[];
  readonly expansions: Record<string, boolean>;
  readonly onExpansionChange: (id: string, state: boolean) => void;

  readonly renderer: (p: ListViewItemRendererProps<D>) => ReactNode;
  readonly axe: ListViewAxe<D>;

  readonly itemHeight?: number;
}
export function ListView<D>({
  paths,
  expansions,
  axe,
  renderer,
  itemHeight = 24,
}: ListViewProps<D>) {
  const tree = useMemo(() => {
    return createPathTree(paths, { considerAdjacency: true });
  }, [paths]);

  const flattenedTree = useMemo(() => {
    const stack = [...tree];

    const flattened = [];
    while (stack.length) {
      const item = stack.shift()!;
      if (item.type === "leaf") {
        flattened.push(item);
      } else {
        if (expansions[item.occurrence] ?? true) {
          stack.unshift(...item.children);
        }
        flattened.push(item);
      }
    }

    return flattened;
  }, [expansions, tree]);

  const [focused, setFocused] = useState<null | number>(null);
  const context = useMemo(() => {
    return { count: flattenedTree.length, expansions, axe, renderer, setFocused, focused };
  }, [axe, expansions, flattenedTree.length, focused, renderer]);

  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <ListViewProvider value={context}>
      <Virt
        elRef={ref}
        tabIndex={0}
        onKeyDown={(ev) => {
          if (document.activeElement === ref.current && ev.key === "ArrowDown") {
            // Focused the first item
            setFocused(0);

            const firstChild = ref.current?.firstElementChild?.firstElementChild;
            if (firstChild?.getAttribute("data-rowindex") !== "0")
              ref.current?.scrollTo({ top: 0 });

            setTimeout(() => {
              const child = ref.current?.firstElementChild?.firstElementChild;

              if (child) (child as HTMLElement).focus();
            }, 20);

            ev.preventDefault();
            ev.stopPropagation();
          }

          if (focused == null) return;

          if (ev.key === "ArrowDown") {
            const next = ref.current?.querySelector(
              `[data-rowindex="${focused + 1}"]`,
            ) as HTMLElement;

            ev.preventDefault();
            ev.stopPropagation();

            if (!next) {
              document.activeElement?.scrollIntoView();
              setTimeout(() => {
                const next = ref.current?.querySelector(
                  `[data-rowindex=${focused + 1}]`,
                ) as HTMLElement;
                if (!next) return;
                next.focus();
              }, 20);

              return;
            }

            const bb = ref.current!.getBoundingClientRect();
            const n = next.getBoundingClientRect();

            next.focus({ preventScroll: true });
            if (bb.bottom - (n.top + n.height) < 0) {
              next.scrollIntoView({ behavior: "smooth", block: "end" });
            }
          }
          if (ev.key === "ArrowUp") {
            const next = ref.current?.querySelector(
              `[data-rowindex="${focused - 1}"]`,
            ) as HTMLElement;

            ev.preventDefault();
            ev.stopPropagation();

            if (!next) {
              document.activeElement?.scrollIntoView();
              setTimeout(() => {
                const next = ref.current?.querySelector(
                  `[data-rowindex=${focused - 1}]`,
                ) as HTMLElement;
                if (!next) return;
                next.focus();
              }, 20);

              return;
            }

            const bb = ref.current!.getBoundingClientRect();
            const n = next.getBoundingClientRect();
            next.focus({ preventScroll: true });
            if (bb.top - n.top > 0) {
              next.scrollIntoView({ behavior: "smooth" });
            }
          }
        }}
        data={flattenedTree}
        itemHeight={itemHeight}
        renderer={ListItemRenderer}
        focusedIndex={focused}
        preventFlash
      />
    </ListViewProvider>
  );
}

function ListItemRenderer<D>(p: RendererProps<PathTreeLeafNode<D> | PathTreeParentNode<D>>) {
  let depth = 1;

  let current = p.data.parent;
  while (current) {
    current = current.parent;
    depth++;
  }
  const ctx = useListView();

  const isExpanded = p.data.type === "parent" ? ctx.expansions[p.data.occurrence] : undefined;
  return (
    <div
      tabIndex={-1}
      data-rowindex={p.rowIndex}
      onFocus={() => ctx.setFocused(p.rowIndex)}
      onBlur={() => ctx.setFocused(null)}
      role="treeitem"
      style={{
        position: "absolute",
        top: p.y,
        height: p.height,
        width: "100%",
        boxSizing: "border-box",
      }}
      aria-posinset={p.rowIndex + 1}
      aria-label={ctx.axe.axeItemLabels(p.data)}
      aria-level={depth}
      aria-setsize={ctx.count}
      aria-expanded={p.data.type === "parent" ? ctx.expansions[p.data.occurrence] : undefined}
    >
      <ctx.renderer
        data={p.data}
        depth={depth - 1}
        expanded={!!isExpanded}
        parent={p.data.type === "parent"}
      />
    </div>
  );
}

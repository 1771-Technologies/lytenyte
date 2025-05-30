import {
  createPathTree,
  type PathTreeInputItem,
  type PathTreeLeafNode,
  type PathTreeParentNode,
} from "@1771technologies/path-tree";
import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ListViewProvider, useListView } from "./list-view-context";
import {
  useEdgeScroll,
  Virtualized,
  type RendererProps,
} from "@1771technologies/lytenyte-core/internal";
import { useCombinedRefs } from "@1771technologies/react-utils";

export interface ListViewItemRendererProps<D> {
  readonly data: PathTreeLeafNode<D> | PathTreeParentNode<D>;
  readonly expanded: boolean;
  readonly parent: boolean;
  readonly depth: number;
  readonly treeFlatIndex: number;
}

export interface ListViewProps<D> {
  readonly paths: PathTreeInputItem<D>[];
  readonly expansions: Record<string, boolean>;
  readonly onExpansionChange: (id: string, state: boolean) => void;
  readonly onAction: (p: PathTreeLeafNode<D> | PathTreeParentNode<D>) => void;
  readonly onKeydown?: (
    p: KeyboardEvent,
    item: PathTreeLeafNode<D> | PathTreeParentNode<D>,
  ) => void;

  readonly edgeScrollActive?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;

  readonly scrollIntoViewIndex?: number;

  readonly itemClassName?: string;
  readonly itemStyle?: CSSProperties;

  readonly renderer: (p: ListViewItemRendererProps<D>) => ReactNode;

  readonly rtl?: boolean;

  readonly itemHeight?: number;
}

export function ListView<D>({
  paths,
  expansions,
  onExpansionChange,
  onKeydown,
  onAction,
  renderer,
  itemClassName,
  itemStyle,
  edgeScrollActive,
  className,
  style,
  rtl = false,
  itemHeight = 24,
  scrollIntoViewIndex,
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
    return {
      count: flattenedTree.length,
      onExpansionChange,
      expansions,
      renderer,
      setFocused,
      onKeydown,
      focused,
      onAction,
      itemClassName,
      itemStyle,
      rtl,
    };
  }, [
    expansions,
    flattenedTree.length,
    focused,
    itemClassName,
    itemStyle,
    onAction,
    onExpansionChange,
    onKeydown,
    renderer,
    rtl,
  ]);

  const ref = useRef<HTMLDivElement | null>(null);

  const r = useEdgeScroll({
    isActive: !!edgeScrollActive,
    direction: "vertical",
  });

  const combined = useCombinedRefs(r, ref);

  return (
    <ListViewProvider value={context}>
      <Virtualized
        elRef={combined}
        className={className}
        style={style}
        tabIndex={0}
        role="tree"
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
              next.scrollIntoView({ behavior: "instant", block: "end" });
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
              next.scrollIntoView({ behavior: "instant" });
            }
          }
        }}
        data={flattenedTree}
        itemHeight={itemHeight}
        renderer={ListItemRenderer}
        focusedIndex={focused}
        scrollIntoViewIndex={scrollIntoViewIndex}
        preventFlash
      />
    </ListViewProvider>
  );
}

function ListItemRenderer<D>(p: RendererProps<PathTreeLeafNode<D> | PathTreeParentNode<D>>) {
  let depth = 1;

  let current = p.data?.parent;
  while (current) {
    current = current?.parent;
    depth++;
  }
  const ctx = useListView();

  const isExpanded =
    p.data?.type === "parent" ? (ctx.expansions[p.data.occurrence] ?? true) : undefined;
  return (
    <div
      tabIndex={-1}
      data-rowindex={p.rowIndex}
      onFocus={() => ctx.setFocused(p.rowIndex)}
      onBlur={() => ctx.setFocused(null)}
      onClick={() => ctx.onAction(p.data)}
      onKeyDown={(ev) => {
        const open = ctx.rtl ? "ArrowLeft" : "ArrowRight";
        const close = ctx.rtl ? "ArrowRight" : "ArrowLeft";

        if (ev.key === " " && p.data.type === "parent") {
          ctx.onExpansionChange(p.data.occurrence, !isExpanded);
          ev.preventDefault();
          return;
        }

        if (ev.key === open && p.data.type === "parent") {
          ctx.onExpansionChange(p.data.occurrence, true);
          ev.preventDefault();
          return;
        }
        if (ev.key === close && p.data.type === "parent") {
          ctx.onExpansionChange(p.data.occurrence, false);
          ev.preventDefault();
          return;
        }

        if (ev.key === "Enter") {
          ctx.onAction(p.data);
          ev.preventDefault();
          return;
        }

        ctx.onKeydown?.(ev.nativeEvent, p.data);
      }}
      role="treeitem"
      style={{
        ...ctx.itemStyle,
        position: "absolute",
        top: p.y,
        height: p.height,
        width: "100%",
        boxSizing: "border-box",
      }}
      className={ctx.itemClassName}
      aria-posinset={p.rowIndex + 1}
      aria-level={depth}
      aria-setsize={ctx.count}
      aria-expanded={p.data.type === "parent" ? ctx.expansions[p.data.occurrence] : undefined}
    >
      <ctx.renderer
        data={p.data}
        depth={depth - 1}
        expanded={!!isExpanded}
        parent={p.data.type === "parent"}
        treeFlatIndex={p.rowIndex}
      />
    </div>
  );
}

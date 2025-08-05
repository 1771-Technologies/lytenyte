import { forwardRef, type CSSProperties, type JSX } from "react";
import { useDepth } from "./depth-provider.js";
import { useTreeRoot } from "./context.js";
import { getFocusables } from "@1771technologies/lytenyte-dom-utils";

export interface TreeLeafProps {
  readonly itemId: string;
}

export const TreeLeaf = forwardRef<HTMLLIElement, JSX.IntrinsicElements["li"] & TreeLeafProps>(
  function TreeLeaf({ itemId, ...props }, forwarded) {
    const depth = useDepth();
    const root = useTreeRoot();

    return (
      <li
        {...props}
        tabIndex={-1}
        data-ln-tree-node
        data-ln-tree-leaf
        data-ln-selected={root.selection.has(itemId)}
        data-ln-tree-id={itemId}
        onKeyDown={(e) => {
          props.onKeyDown?.(e);
          if (
            (e.key !== "ArrowLeft" && e.key !== "ArrowRight") ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey
          )
            return;

          const nodes = getFocusables(e.currentTarget) as HTMLElement[];
          const index = nodes.indexOf(document.activeElement! as HTMLElement);
          if (index === -1) {
            nodes.at(0)?.focus();
            return;
          }
          if (e.key === "ArrowLeft") nodes[index === 0 ? nodes.length - 1 : index - 1].focus();
          else nodes[index === nodes.length - 1 ? 0 : index + 1].focus();
        }}
        ref={forwarded}
        role="treeitem"
        aria-level={depth + 1}
        aria-selected={root.selection.has(itemId)}
        style={{ ...props.style, "--tree-depth": depth } as CSSProperties}
      >
        {props.children}
      </li>
    );
  },
);

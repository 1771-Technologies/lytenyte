import { forwardRef, type CSSProperties, type JSX } from "react";
import { useDepth } from "./depth-provider";
import { useTreeRoot } from "./context";

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
        ref={forwarded}
        role="treeitem"
        aria-selected={root.selection.has(itemId)}
        style={{ ...props.style, "--tree-depth": depth } as CSSProperties}
      >
        {props.children}
      </li>
    );
  },
);

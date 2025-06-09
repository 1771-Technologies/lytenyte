import { forwardRef, type JSX } from "react";
import { depthContext } from "../depth-provider";
import { useTreeRoot } from "../context";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";
import { useTreeNavigation } from "./use-tree-navigation";

export const TreePanel = forwardRef<HTMLUListElement, JSX.IntrinsicElements["ul"]>(
  function TreePanel(props, forwarded) {
    const ctx = useTreeRoot();

    const ref = useForkRef(ctx.panelRef, forwarded);

    const focused = useTreeNavigation();

    return (
      <depthContext.Provider value={0}>
        <ul
          {...props}
          role="tree"
          ref={ref}
          tabIndex={focused ? -1 : 0}
          aria-multiselectable={ctx.selectionMode === "multiple"}
          aria-orientation="vertical"
        >
          {props.children}
        </ul>
      </depthContext.Provider>
    );
  },
);

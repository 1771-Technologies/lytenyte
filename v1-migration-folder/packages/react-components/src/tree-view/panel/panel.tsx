import { forwardRef, useRef, type JSX } from "react";
import { depthContext } from "../depth-provider.js";
import { useTreeRoot } from "../context.js";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";
import { useTreeNavigation } from "./use-tree-navigation.js";
import { getFocusedNode } from "../utils/get-focused-node.js";
import { getFirstNode } from "../navigation/get-first-node.js";

export const TreePanel = forwardRef<HTMLUListElement, JSX.IntrinsicElements["ul"]>(
  function TreePanel(props, forwarded) {
    const ctx = useTreeRoot();

    const ref = useForkRef(ctx.panelRef, forwarded);

    const focused = useTreeNavigation();

    const focusTime = useRef<ReturnType<typeof setTimeout>>(null);

    return (
      <depthContext.Provider value={0}>
        <ul
          {...props}
          role="tree"
          ref={ref}
          tabIndex={focused ? -1 : 0}
          aria-multiselectable={ctx.selectionMode === "multiple"}
          aria-orientation="vertical"
          data-ln-tree-panel
          onFocus={() => {
            if (focusTime.current) {
              clearTimeout(focusTime.current);
              focusTime.current = null;
            }

            ctx.onFocusChange(getFocusedNode());
          }}
          onBlur={() => {
            if (focusTime.current) return;

            focusTime.current = setTimeout(() => {
              ctx.onFocusChange(null);
              focusTime.current = null;
            }, 20);
          }}
        >
          {props.children}
        </ul>
        <div
          role="presentation"
          tabIndex={focused ? -1 : 0}
          onFocus={() => {
            getFirstNode(ctx.panel!)?.focus();
          }}
        />
      </depthContext.Provider>
    );
  },
);

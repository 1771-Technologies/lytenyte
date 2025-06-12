import { forwardRef, useEffect, type CSSProperties, type JSX, type PropsWithChildren } from "react";
import { depthContext, useDepth } from "../depth-provider";
import {
  useEvent,
  useSlot,
  useTransitionedOpen,
  type SlotComponent,
} from "@1771technologies/lytenyte-react-hooks";
import { useTreeRoot } from "../context";
import { useBranchKeys } from "./use-branch-keys";

export interface TreeBranchProps {
  readonly itemId: string;

  readonly label?: SlotComponent;
  readonly expander?: SlotComponent;

  readonly transitionEnterMs?: number;
  readonly transitionExitMs?: number;
  readonly gridWrapped?: boolean;
}

export const TreeBranch = forwardRef<HTMLLIElement, JSX.IntrinsicElements["li"] & TreeBranchProps>(
  function TreeBranch(
    { itemId, label, expander, transitionEnterMs, transitionExitMs, gridWrapped, ...props },
    forwarded,
  ) {
    const depth = useDepth();
    const root = useTreeRoot();

    // Manage the open and close state of the branch
    const expanded = root.expansions[itemId] ?? root.expansionDefault ?? false;

    const { open, shouldMount, state, toggle } = useTransitionedOpen({
      initial: expanded,
      timeEnter: transitionEnterMs ?? root.transitionEnterMs,
      timeExit: transitionExitMs ?? root.transitionExitMs,
    });

    const onExpansionChange = useEvent((b: boolean) => {
      root.onExpansionChange({
        ...root.expansions,
        [itemId]: b,
      });
    });

    useEffect(() => {
      if (expanded === open) return;
      toggle(expanded);
    }, [expanded, open, toggle]);

    // Component part rendering
    const labelRendered = useSlot({
      props: [],
      slot: label ?? <div />,
    });

    const expandedProps: JSX.IntrinsicElements["div"] = {
      onClick: () => {
        onExpansionChange(!expanded);
      },
    };

    const expanderRendered = useSlot({
      props: [expandedProps],
      slot: expander ?? <button>{">"}</button>,
    });

    const wrapped = gridWrapped ?? root.gridWrappedBranches;

    return (
      <depthContext.Provider value={depth + 1}>
        <li
          {...props}
          onKeyDown={useBranchKeys(itemId, root.expansionDefault ?? false, props.onKeyDown)}
          tabIndex={-1}
          ref={forwarded}
          role="treeitem"
          aria-expanded={open}
          aria-selected={root.selection.has(itemId)}
          aria-level={depth + 1}
          data-ln-selected={root.selection.has(itemId)}
          data-ln-tree-node
          data-ln-tree-branch
          data-ln-tree-id={itemId}
          style={
            {
              ...props.style,
              "--tree-depth": depth,
            } as CSSProperties
          }
        >
          <div data-tree-branch-label>
            {expanderRendered}
            {labelRendered}
          </div>
          <div>
            <Wrapped wrapped={wrapped} expanded={open}>
              {shouldMount && (
                <ul
                  data-tree-branch-children
                  data-expanded={open}
                  data-open-state={state}
                  role="group"
                >
                  {props.children}
                </ul>
              )}
            </Wrapped>
          </div>
        </li>
      </depthContext.Provider>
    );
  },
);

function Wrapped(props: PropsWithChildren<{ wrapped: boolean; expanded: boolean }>) {
  if (!props.wrapped) return <>{props.children}</>;

  return (
    <div data-tree-branch-grid-wrapped data-expanded={props.expanded}>
      <div data-tree-branch-grid-wrapped-content>{props.children}</div>
    </div>
  );
}

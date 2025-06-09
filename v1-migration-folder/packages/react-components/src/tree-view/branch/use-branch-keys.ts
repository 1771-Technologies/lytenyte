import { useEvent } from "@1771technologies/lytenyte-react-hooks";
import type { KeyboardEvent, KeyboardEventHandler } from "react";
import { useTreeRoot } from "../context";
import { getFocusableNodes } from "../utils/get-focusable-nodes";
import { getFocusedNode } from "../utils/get-focused-node";
import { isBranchNode } from "../utils/is-branch-node";
import { getTreeNodeId } from "../utils/get-tree-node-id";
import { getParentNode } from "../utils/get-parent-node";
import { getSiblingBranches } from "../utils/get-sibling-branches";

const accepted = ["ArrowRight", "ArrowLeft", "Enter", "*"];

export function useBranchKeys(
  id: string,
  defaultExpansion: boolean,
  current?: KeyboardEventHandler,
) {
  const ctx = useTreeRoot();
  const onKeyDown = useEvent((ev: KeyboardEvent) => {
    current?.(ev);

    if (!accepted.includes(ev.key)) return;

    const isExpanded = ctx.expansions[id] ?? defaultExpansion;

    if (ev.key === "*") {
      const node = getFocusedNode()!;

      const siblings = getSiblingBranches(node);

      const next = { ...ctx.expansions };

      siblings?.forEach((c) => {
        next[getTreeNodeId(c)] = true;
      });
      ctx.onExpansionChange(next);

      ev.stopPropagation();
      return;
    }

    if (ev.key === "Enter") {
      if (ev.currentTarget !== ev.target) return;
      const next = { ...ctx.expansions };
      next[id] = !isExpanded;

      ctx.onExpansionChange(next);
      return;
    }

    if (ev.key === "ArrowRight") {
      const branch = getFocusedNode();
      if (ev.currentTarget !== branch) return;

      if (!isExpanded) {
        const next = { ...ctx.expansions };

        next[id] = !(next[id] ?? defaultExpansion);
        ctx.onExpansionChange(next);
        return;
      }

      const nodes = getFocusableNodes(branch);
      nodes.at(0)?.focus();
    }

    if (ev.key === "ArrowLeft") {
      const node = getFocusedNode()!;

      // We need to collapse this node
      if (isBranchNode(node) && isExpanded) {
        // Ensure we don't collapse the node when the event bubbles and the left arrow
        // was pressed on a child element. Pressing left arrow on the child will focus the
        // parent, and then run the parent's on keydown handler.
        if (ev.target !== ev.currentTarget) return;

        const next = { ...ctx.expansions };
        const id = getTreeNodeId(node);
        next[id] = false;

        ctx.onExpansionChange(next);
        return;
      } else {
        const parent = getParentNode(node);
        if (!parent) {
          const focusNodes = getFocusableNodes(ctx.panel!);
          focusNodes.at(0)?.focus();
        } else {
          parent.focus();
        }
      }
    }
  });

  return onKeyDown;
}

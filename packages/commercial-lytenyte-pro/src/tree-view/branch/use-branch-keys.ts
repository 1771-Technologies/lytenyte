import type { KeyboardEvent, KeyboardEventHandler } from "react";
import { useTreeRoot } from "../context.js";
import { getFocusableNodes } from "../utils/get-focusable-nodes.js";
import { getFocusedNode } from "../utils/get-focused-node.js";
import { isBranchNode } from "../utils/is-branch-node.js";
import { getTreeNodeId } from "../utils/get-tree-node-id.js";
import { getParentNode } from "../utils/get-parent-node.js";
import { getSiblingBranches } from "../utils/get-sibling-branches.js";
import { getFocusables } from "@1771technologies/lytenyte-dom-utils";
import { useEvent } from "@1771technologies/lytenyte-core/yinternal";

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

      const childNodes = getFocusables(branch.firstElementChild!) as HTMLElement[];
      if (childNodes.length > 1 && childNodes.at(-1) !== document.activeElement) {
        const current = childNodes.indexOf(document.activeElement as HTMLElement);

        const index = current === -1 || current === 0 ? 1 : current + 1;

        childNodes[index]?.focus();
        return;
      }

      // Get the first focusable node.
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
        if (
          ev.target !== ev.currentTarget &&
          !ev.currentTarget.firstElementChild?.contains(document.activeElement!)
        )
          return;

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

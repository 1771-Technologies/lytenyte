import { useEffect, useState } from "react";
import { useTreeRoot } from "../context";
import { getFocusableNodes } from "../utils/get-focusable-nodes";
import { makeHandleTypeahead } from "./make-handle-typeahead";
import { makeHandleNavigation } from "./make-handle-navigation";
import { makeHandleSelection } from "./make-handle-selection";
import { getTreeNodeId } from "../utils/get-tree-node-id";

export function useTreeNavigation() {
  const ctx = useTreeRoot();
  const [focused, setFocused] = useState(false);

  const panel = ctx.panel;
  useEffect(() => {
    if (!panel) return;

    const controller = new AbortController();
    panel.addEventListener(
      "focus",
      () => {
        const focusNodes = getFocusableNodes(panel);

        if (ctx.selectionMode !== "none" && ctx.selection.size > 0) {
          const node = focusNodes.find((c) => ctx.selection.has(getTreeNodeId(c)));

          if (node) {
            node.focus();
            return;
          }
        }

        focusNodes.at(0)?.focus();
      },
      { signal: controller.signal },
    );

    panel.addEventListener(
      "focusin",
      () => {
        setFocused(true);
      },
      { signal: controller.signal },
    );
    panel.addEventListener(
      "focusout",
      () => {
        setFocused(false);
      },
      { signal: controller.signal },
    );

    const handleTypeahead = makeHandleTypeahead();
    const handleNavigation = makeHandleNavigation();
    const handleSelection = makeHandleSelection(ctx);

    panel.addEventListener(
      "keydown",
      (ev) => {
        handleTypeahead(panel, ev);
        handleNavigation(panel, ev);
        handleSelection(ev);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [ctx, panel]);

  return focused;
}

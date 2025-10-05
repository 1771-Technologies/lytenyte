import { useEffect, useState } from "react";
import { useTreeRoot } from "../context.js";
import { getFocusableNodes } from "../utils/get-focusable-nodes.js";
import { makeHandleTypeahead } from "./make-handle-typeahead.js";
import { makeHandleNavigation } from "./make-handle-navigation.js";
import { makeHandleSelection } from "./make-handle-selection.js";
import { getTreeNodeId } from "../utils/get-tree-node-id.js";
import { getTabbables } from "@1771technologies/lytenyte-shared";

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
    const handleNavigation = makeHandleNavigation(ctx);
    const handleSelection = makeHandleSelection(ctx);

    panel.addEventListener(
      "keydown",
      (ev) => {
        handleTypeahead(panel, ev);
        handleNavigation(ev);
        handleSelection(ev);

        if (ev.key === "Tab") {
          const els = getTabbables(panel as any) as HTMLElement[];
          if (!els.length) return;

          const original = els.map((el) => {
            const o = el.getAttribute("tabindex");
            el.tabIndex = -1;

            return o;
          });
          requestAnimationFrame(() => {
            els.forEach((el, i) => {
              if (original[i] == null) el.removeAttribute("tabindex");
              else el.setAttribute("tabindex", original[i]);
            });
          });
        }
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [ctx, focused, panel]);

  return focused;
}

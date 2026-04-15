import { forwardRef, useCallback, useEffect, useRef } from "react";
import { useAccordionItem } from "./accordion-item-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";
import { useSlot } from "../hooks/use-slot.js";
import type { Accordion } from "./accordion";
import { useAccordionRoot } from "./accordion-context.js";
import { useIsoEffect } from "../hooks/use-iso-effect.js";
import { useTransitionedOpen, type TransitionStatus } from "../hooks/use-transition-status.js";
import { useCombinedRefs } from "../hooks/use-combined-ref.js";
import { CSS_PANEL_HEIGHT, CSS_PANEL_WIDTH, DATA_ACCORDION_PANEL } from "../constants.js";

function AccordionPanelBase(
  {
    render,
    style: providedStyle,
    className: providedClassName,
    keepMounted: providedKeepMounted,
    hiddenUntilFound: providedHiddenUntilFound,
    ...props
  }: Accordion.Panel.Props,
  ref: Accordion.Panel.Props["ref"],
) {
  const ctx = useAccordionItem();
  const rootCtx = useAccordionRoot();
  const isHiddenUntilFound = providedHiddenUntilFound ?? rootCtx.hiddenUntilFound;

  const onStatusChange = useCallback(
    (next: TransitionStatus, _prev: TransitionStatus, el: HTMLElement) => {
      if (next === "idle") {
        el.style.setProperty(CSS_PANEL_HEIGHT, "auto");
        el.style.setProperty(CSS_PANEL_WIDTH, "auto");
        ctx.onOpenChangeComplete?.(true);
      } else if (next === "closed") {
        ctx.onOpenChangeComplete?.(false);
        if (isHiddenUntilFound) {
          el.setAttribute("hidden", "until-found");
        }
      } else {
        if (next === "start" && isHiddenUntilFound) {
          el.removeAttribute("hidden");
        }
        el.style.setProperty(CSS_PANEL_HEIGHT, `${el.scrollHeight}px`);
        el.style.setProperty(CSS_PANEL_WIDTH, `${el.scrollWidth}px`);
      }
    },
    [ctx, isHiddenUntilFound],
  );

  const { mounted, ref: transitionRef } = useTransitionedOpen(ctx.state.open, onStatusChange);

  const panelRef = useRef<HTMLElement | null>(null);

  // Set hidden="until-found" before first paint for initially-closed panels.
  // Subsequent open/close transitions are handled by onStatusChange.
  useIsoEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (isHiddenUntilFound && !ctx.state.open) {
      el.setAttribute("hidden", "until-found");
    } else {
      el.removeAttribute("hidden");
    }
  }, [isHiddenUntilFound]);

  useEffect(() => {
    if (!isHiddenUntilFound) return;
    const el = panelRef.current;
    if (!el) return;

    const onBeforeMatch = () => {
      if (!ctx.state.open) ctx.toggle();
    };

    el.addEventListener("beforematch", onBeforeMatch);
    return () => el.removeEventListener("beforematch", onBeforeMatch);
  }, [isHiddenUntilFound, ctx.state.open, ctx.toggle, ctx]);

  useIsoEffect(() => {
    if (!props.id) return;
    ctx.setPanelId(props.id);
  }, [props.id]);

  const className = useClassName(providedClassName, ctx.state);
  const style = useStyle(providedStyle, ctx.state);

  const slot = useSlot({
    slot: render ?? <div />,
    ref: useCombinedRefs(ref, transitionRef, panelRef),
    props: [
      {
        id: ctx.panelId,
        role: "region",
        "aria-labelledby": ctx.triggerId,
      },
      props,
      { className, style, [DATA_ACCORDION_PANEL]: "", ...ctx.attrs },
    ],
    state: ctx.state,
  });

  const keepMounted = isHiddenUntilFound || providedKeepMounted || rootCtx.keepMounted;
  if (!mounted && !keepMounted) return null;

  return slot;
}

export const AccordionPanel = forwardRef(AccordionPanelBase);

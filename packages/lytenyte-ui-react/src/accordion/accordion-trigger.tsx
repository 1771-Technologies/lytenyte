import type { JSX } from "react";
import { forwardRef } from "react";
import { useAccordionItem } from "./accordion-item-context.js";
import { useAccordionRoot } from "./accordion-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";
import { useSlot } from "../hooks/use-slot.js";
import type { Accordion } from "./accordion";
import { useIsoEffect } from "../hooks/use-iso-effect.js";
import { DATA_ACCORDION_TRIGGER, DATA_ROOT_ID } from "../constants.js";

function AccordionTriggerBase(
  { render, style: providedStyle, className: providedClassName, ...props }: Accordion.Trigger.Props,
  ref: Accordion.Trigger.Props["ref"],
) {
  const ctx = useAccordionItem();
  const rootCtx = useAccordionRoot();

  const className = useClassName(providedClassName, ctx.state);
  const style = useStyle(providedStyle, ctx.state);

  useIsoEffect(() => {
    if (!props.id) return;
    ctx.setTriggerId(props.id);
  }, [props.id]);

  const slot = useSlot({
    slot: render ?? <button />,
    ref,
    props: [
      {
        id: ctx.triggerId,
        "aria-disabled": ctx.state.disabled || undefined,
        "aria-expanded": ctx.state.open,
        "aria-controls": ctx.panelId,
      } satisfies JSX.IntrinsicElements["div"],
      props,
      {
        className,
        style,
        [DATA_ROOT_ID]: rootCtx.rootId,
        [DATA_ACCORDION_TRIGGER]: "",
        ...ctx.attrs,
        onClick: () => ctx.toggle(),
      },
    ],
    state: ctx.state,
  });

  return slot;
}

export const AccordionTrigger = forwardRef(AccordionTriggerBase);

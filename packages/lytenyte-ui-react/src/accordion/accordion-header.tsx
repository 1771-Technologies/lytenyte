import { forwardRef } from "react";
import { useSlot } from "../hooks/use-slot.js";
import { useAccordionItem } from "./accordion-item-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";
import type { Accordion } from "./accordion";
import { DATA_ACCORDION_HEADER } from "../constants.js";

function AccordionHeaderBase(
  { render, style: providedStyle, className: providedClassName, ...props }: Accordion.Header.Props,
  ref: Accordion.Header.Props["ref"],
) {
  const ctx = useAccordionItem();

  const className = useClassName(providedClassName, ctx.state);
  const style = useStyle(providedStyle, ctx.state);

  const slot = useSlot({
    slot: render ?? <h3 />,
    ref,
    props: [props, { className, style, [DATA_ACCORDION_HEADER]: "", ...ctx.attrs }],
    state: ctx.state,
  });

  return slot;
}

export const AccordionHeader = forwardRef(AccordionHeaderBase);

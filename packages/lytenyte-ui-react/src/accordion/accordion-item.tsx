import { forwardRef, type ReactElement } from "react";
import type { Accordion } from "./accordion-root";
import { useSlot } from "../hooks/use-slot.js";

function AccordionItemBase<T>(
  { value, onOpenChange, disabled, style, className, render, ...props }: Accordion.Item.Props<T>,
  ref: Accordion.Item.Props<T>["ref"],
) {
  const slot = useSlot<Accordion.Item.State>({
    slot: render ?? <div />,
    props: [props],
    ref: ref,
  });

  return slot;
}

export const AccordionItem = forwardRef(AccordionItemBase) as <T>(
  props: Accordion.Item.Props<T>,
) => ReactElement;

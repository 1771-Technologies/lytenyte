import { forwardRef, useId, useMemo, useState, type ReactElement } from "react";
import { useSlot } from "../hooks/use-slot.js";
import type { AccordionItemContext } from "./accordion-item-context";
import { AccordionItemProvider } from "./accordion-item-context.js";
import { useAccordionRoot } from "./accordion-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";
import type { Accordion } from "./accordion.js";
import { useEvent } from "../hooks/use-event.js";
import { DATA_ACCORDION_ITEM, DATA_CLOSED, DATA_DISABLED, DATA_OPEN } from "../constants.js";

function AccordionItemBase<T>(
  {
    value: providedValue,
    collapsible,
    onOpenChange,
    onOpenChangeComplete,
    disabled: providedDisabled,
    style: providedStyle,
    className: providedClassName,
    render,
    ...props
  }: Accordion.Item.Props<T>,
  ref: Accordion.Item.Props<T>["ref"],
) {
  const fallbackValue = useId();
  const value = providedValue ?? fallbackValue;

  const [triggerId, setTriggerId] = useState(useId());
  const [panelId, setPanelId] = useState(useId());

  const root = useAccordionRoot();

  const disabled = providedDisabled ?? root.disabled;

  const state = useMemo<Accordion.Item.State>(() => {
    const open = root.value.includes(value);

    return {
      disabled,
      orientation: root.orientation,
      value: root.value,
      open,
    };
  }, [disabled, root.orientation, root.value, value]);

  const className = useClassName(providedClassName, state);
  const style = useStyle(providedStyle, state);

  const attrs = useMemo(() => {
    return {
      ...root.attrs,
      [DATA_CLOSED]: !state.open || undefined,
      [DATA_OPEN]: state.open || undefined,
      [DATA_DISABLED]: disabled || undefined,
    };
  }, [disabled, root.attrs, state.open]);

  const toggle = useEvent(function toggle() {
    if (disabled) return;

    const isOpen = root.value.includes(value);
    if (isOpen && !(collapsible ?? root.collapsible)) return;

    root.onValueChange(value);
    onOpenChange?.(!isOpen);
  });

  const slot = useSlot<Accordion.Item.State>({
    slot: render ?? <div />,
    props: [props, { className, style, [DATA_ACCORDION_ITEM]: "", ...attrs, onClick: () => {} }],
    ref: ref,
    state,
  });

  const contextValue = useMemo<AccordionItemContext>(() => {
    return {
      collapsible: collapsible ?? root.collapsible,
      hiddenUntilFound: root.hiddenUntilFound,
      state,
      attrs,
      toggle,
      triggerId,
      setTriggerId,
      panelId,
      setPanelId,
      onOpenChangeComplete,
    };
  }, [
    attrs,
    collapsible,
    onOpenChangeComplete,
    panelId,
    root.collapsible,
    root.hiddenUntilFound,
    state,
    toggle,
    triggerId,
  ]);

  return <AccordionItemProvider value={contextValue}>{slot}</AccordionItemProvider>;
}

export const AccordionItem = forwardRef(AccordionItemBase) as <T>(
  props: Accordion.Item.Props<T>,
) => ReactElement;

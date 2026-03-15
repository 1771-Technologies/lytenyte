import type { JSX } from "react";
import { forwardRef, useId, useMemo, type KeyboardEvent } from "react";
import { useSlot } from "../hooks/use-slot.js";
import { useControlled } from "../hooks/use-controlled.js";
import type { AccordionContextValue } from "./accordion-context.js";
import { AccordionRootProvider } from "./accordion-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";
import type { Accordion } from "./accordion.js";
import { useEvent } from "../hooks/use-event.js";
import { DATA_ACCORDION_ROOT, DATA_DISABLED, DATA_ORIENTATION, DATA_ROOT_ID } from "../constants.js";
import { useDirection } from "../direction-provider/direction-provider.js";

function AccordionRootImpl<T = any>(
  {
    render,
    collapsible,
    value: providedValue,
    defaultValue,
    hiddenUntilFound,
    disabled: providedDisabled,
    multiple,
    loopFocus,
    orientation: providedOrientation,
    style: providedStyle,
    className: providedClassName,
    keepMounted,
    onValueChange: providedValueChange,
    ...props
  }: Accordion.Props<T>,
  forwarded: Accordion.Props<T>["ref"],
) {
  const rootId = useId();
  const [value, setValue] = useControlled({
    controlled: providedValue,
    default: defaultValue ?? [],
  });
  const disabled = providedDisabled ?? false;
  const orientation = providedOrientation ?? "vertical";

  const onValueChange = useEvent(function onValueChange(v: T) {
    if (multiple) {
      const next = value.includes(v) ? value.filter((x) => x != v) : [...value, v];

      setValue(next);
      providedValueChange?.(next);
    } else {
      const next = value.includes(v) ? [] : [v];

      setValue(next);
      providedValueChange?.(next);
    }
  });

  const state = useMemo<Accordion.State>(() => {
    return { value, disabled, orientation };
  }, [value, disabled, orientation]);

  const className = useClassName(providedClassName, state);
  const style = useStyle(providedStyle, state);

  const sharedAttrs = useMemo(() => {
    return {
      [DATA_ORIENTATION]: providedOrientation,
      [DATA_DISABLED]: disabled || undefined,
    };
  }, [disabled, providedOrientation]);

  const direction = useDirection();

  const handleKeyDown = useEvent((e: KeyboardEvent<HTMLElement>) => {
    const isVertical = orientation === "vertical";

    let move: "next" | "prev" | "first" | "last" | null = null;

    if (isVertical) {
      if (e.key === "ArrowDown") move = "next";
      if (e.key === "ArrowUp") move = "prev";
    } else {
      if (e.key === "ArrowRight") move = direction === "rtl" ? "prev" : "next";
      if (e.key === "ArrowLeft") move = direction === "rtl" ? "next" : "prev";
    }

    if (e.key === "Home") move = "first";
    if (e.key === "End") move = "last";

    if (!move) return;

    const rootEl = e.currentTarget;
    const selector = `[${DATA_ROOT_ID}="${rootId}"]`;
    const triggers = Array.from(rootEl.querySelectorAll<HTMLElement>(selector));

    if (triggers.length === 0) return;

    const active = (e.target as HTMLElement).closest?.(selector);
    const currentIndex = active ? triggers.indexOf(active as HTMLElement) : -1;
    if (currentIndex === -1) return; // Focus is not a trigger, so we should do nothing.

    e.preventDefault();

    const loop = loopFocus ?? true;
    let nextIndex: number;

    switch (move) {
      case "next":
        nextIndex = currentIndex + 1;
        if (nextIndex >= triggers.length) nextIndex = loop ? 0 : triggers.length - 1;
        break;
      case "prev":
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = loop ? triggers.length - 1 : 0;
        break;
      case "first":
        nextIndex = 0;
        break;
      case "last":
        nextIndex = triggers.length - 1;
        break;
    }

    triggers[nextIndex]?.focus();
  });

  const slot = useSlot<Accordion.State<T>>({
    slot: render ?? <div />,
    props: [
      { dir: direction, onKeyDown: handleKeyDown } satisfies JSX.IntrinsicElements["div"],
      props,
      { className, style, [DATA_ACCORDION_ROOT]: "", ...sharedAttrs },
    ],
    ref: forwarded,
    state: state,
  });

  const contextValue = useMemo<AccordionContextValue>(() => {
    return {
      rootId,
      collapsible: collapsible ?? true,
      disabled: disabled,
      hiddenUntilFound: hiddenUntilFound ?? false,
      keepMounted: keepMounted ?? false,
      value,
      attrs: sharedAttrs,
      orientation: orientation,
      onValueChange,
    };
  }, [
    rootId,
    collapsible,
    disabled,
    hiddenUntilFound,
    keepMounted,
    onValueChange,
    orientation,
    sharedAttrs,
    value,
  ]);

  return <AccordionRootProvider value={contextValue}>{slot}</AccordionRootProvider>;
}

export const AccordionRoot = forwardRef(AccordionRootImpl);

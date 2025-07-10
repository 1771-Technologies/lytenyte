import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useMultiSelectRoot, type MultiSelectState } from "./context.js";
import { forwardRef, useEffect, type JSX } from "react";

export interface MultiSelectTagProps {
  readonly tag: string;
  readonly as?: SlotComponent<MultiSelectState>;
  readonly removable?: boolean;
}

export const MultiSelectTag = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["button"] & MultiSelectTagProps
>(function MultiSelectTag({ as, tag, removable = true, ...props }, forwarded) {
  const ctx = useMultiSelectRoot();

  const input = ctx.input;
  const tagActive = ctx.isTagActive(tag);
  const registerRemove = input && tagActive && removable;

  useEffect(() => {
    if (!registerRemove) return;

    const controller = new AbortController();
    input.addEventListener(
      "keydown",
      (ev) => {
        if (ev.key === "Enter" && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) ctx.removeSelect(tag);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [ctx, input, registerRemove, tag]);

  const slot = useSlot({
    props: [props, { "data-ln-tag-active": tagActive }],
    ref: forwarded,
    slot: as ?? <button />,
    state: ctx.state,
  });

  return slot;
});

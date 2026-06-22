import { forwardRef } from "react";
import { useDialogRoot } from "./dialog-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";
import { useSlot } from "../hooks/use-slot.js";
import { useCombinedRefs } from "../hooks/use-combined-ref.js";
import type { Dialog } from "./dialog.js";
import { DATA_DIALOG_TRIGGER } from "../constants.js";

function DialogTriggerBase(
  { render, style: providedStyle, className: providedClassName, ...props }: Dialog.Trigger.Props,
  ref: Dialog.Trigger.Props["ref"],
) {
  const ctx = useDialogRoot();
  const state: Dialog.State = { open: ctx.open, modal: ctx.modal };

  const className = useClassName(providedClassName, state);
  const style = useStyle(providedStyle, state);

  const slot = useSlot({
    slot: render ?? <button />,
    ref: useCombinedRefs(ref, ctx.triggerRef),
    props: [
      {
        "aria-expanded": ctx.open,
        "aria-haspopup": "dialog" as const,
      },
      props,
      { className, style, [DATA_DIALOG_TRIGGER]: "", onClick: () => ctx.onOpenChange(true) },
    ],
    state,
  });

  return slot;
}

export const DialogTrigger = forwardRef(DialogTriggerBase);

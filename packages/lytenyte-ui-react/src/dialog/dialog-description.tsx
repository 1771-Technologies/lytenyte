import { forwardRef, useId, useMemo } from "react";
import { useDialogRoot } from "./dialog-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";
import { useSlot } from "../hooks/use-slot.js";
import { useIsoEffect } from "../hooks/use-iso-effect.js";
import type { Dialog } from "./dialog.js";
import { DATA_DIALOG_DESCRIPTION } from "../constants.js";

function DialogDescriptionBase(
  { render, style: providedStyle, className: providedClassName, ...props }: Dialog.Description.Props,
  ref: Dialog.Description.Props["ref"],
) {
  const ctx = useDialogRoot();
  const fallbackId = useId();
  const state: Dialog.State = useMemo(() => ({ open: ctx.open, modal: ctx.modal }), [ctx.modal, ctx.open]);

  // Register the description ID with the root context so Content
  // can set aria-describedby. Only set when this component mounts.
  const resolvedId = props.id ?? fallbackId;
  useIsoEffect(() => {
    ctx.setDescriptionId(resolvedId);
  }, [resolvedId]);

  const className = useClassName(providedClassName, state);
  const style = useStyle(providedStyle, state);

  const slot = useSlot({
    slot: render ?? <p />,
    ref,
    props: [
      { id: resolvedId },
      props,
      {
        className,
        style,
        [DATA_DIALOG_DESCRIPTION]: "",
      },
    ],
    state,
  });

  return slot;
}

export const DialogDescription = forwardRef(DialogDescriptionBase);

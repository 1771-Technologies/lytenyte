import { forwardRef, useMemo } from "react";
import { useDialogRoot } from "./dialog-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";
import { useSlot } from "../hooks/use-slot.js";
import { useIsoEffect } from "../hooks/use-iso-effect.js";
import type { Dialog } from "./dialog.js";
import { DATA_DIALOG_TITLE } from "../constants.js";

function DialogTitleBase(
  { render, style: providedStyle, className: providedClassName, ...props }: Dialog.Title.Props,
  ref: Dialog.Title.Props["ref"],
) {
  const ctx = useDialogRoot();
  const state: Dialog.State = useMemo(() => ({ open: ctx.open, modal: ctx.modal }), [ctx.modal, ctx.open]);

  useIsoEffect(() => {
    if (!props.id) return;
    ctx.setTitleId(props.id);
  }, [props.id]);

  const className = useClassName(providedClassName, state);
  const style = useStyle(providedStyle, state);

  const slot = useSlot({
    slot: render ?? <h2 />,
    ref,
    props: [{ id: ctx.titleId }, props, { className, style, [DATA_DIALOG_TITLE]: "" }],
    state,
  });

  return slot;
}

export const DialogTitle = forwardRef(DialogTitleBase);

import { forwardRef, useCallback, useEffect, useRef } from "react";
import { useDialogRoot } from "./dialog-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";
import { useSlot } from "../hooks/use-slot.js";
import { useIsoEffect } from "../hooks/use-iso-effect.js";
import { useTransitionedOpen, type TransitionStatus } from "../hooks/use-transition-status.js";
import { useCombinedRefs } from "../hooks/use-combined-ref.js";
import { useEvent } from "../hooks/use-event.js";
import type { Dialog } from "./dialog.js";
import { DATA_DIALOG_CONTENT, DATA_MODAL, DATA_OPEN, DATA_CLOSED } from "../constants.js";

function DialogContentBase(
  {
    render,
    style: providedStyle,
    className: providedClassName,
    keepMounted,
    onOpenChangeComplete,
    ...props
  }: Dialog.Content.Props,
  ref: Dialog.Content.Props["ref"],
) {
  const ctx = useDialogRoot();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const state: Dialog.State = { open: ctx.open, modal: ctx.modal };

  const onStatusChange = useCallback(
    (next: TransitionStatus, _prev: TransitionStatus, el: HTMLElement) => {
      if (next === "idle") {
        onOpenChangeComplete?.(true);
      } else if (next === "closed") {
        const dialog = el as HTMLDialogElement;
        dialog.close();
        onOpenChangeComplete?.(false);
      }
    },
    [onOpenChangeComplete],
  );

  const { mounted, ref: transitionRef } = useTransitionedOpen(ctx.open, onStatusChange);

  // Show the native dialog when the element mounts into the DOM.
  // `mounted` is needed because on the first render with open=true,
  // the element doesn't exist yet (returns null). useTransitionedOpen
  // sets mounted=true on the next render, which re-triggers this effect.
  useIsoEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (ctx.open && !dialog.open) {
      if (ctx.modal) {
        dialog.showModal();
      } else {
        dialog.show();
      }
    }
  }, [ctx.open, ctx.modal, mounted]);

  // Escape via React onKeyDown (passed in slot props below).
  // Gated on closeOnEscape so AlertDialog can disable it.
  // stopPropagation prevents nested dialogs from closing their parents.
  const handleEscapeKeyDown = useEvent((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      if (ctx.closeOnEscape) {
        ctx.onOpenChange(false);
      }
    }
  });

  // Block the browser's native cancel event (fired on Escape for modal
  // dialogs) so the browser doesn't close the dialog out from under us.
  // We handle close logic ourselves via handleEscapeKeyDown / document listener.
  const handleCancel = useEvent((e: Event) => {
    e.preventDefault();
  });

  // Sync React state if the dialog was closed by something we didn't
  // intercept (e.g. form[method=dialog] submit). Prevents desync where
  // the native dialog is closed but React still thinks it's open.
  const handleClose = useEvent(() => {
    if (ctx.open) {
      ctx.onOpenChange(false);
    }
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
    };
  }, [handleCancel, handleClose, mounted]);

  // Non-modal dialogs don't trap focus, so the user may have focus
  // outside the dialog. A document-level listener ensures Escape
  // closes the dialog regardless of where focus is.
  const handleDocumentKeyDown = useEvent((e: KeyboardEvent) => {
    if (e.key === "Escape" && ctx.closeOnEscape) {
      ctx.onOpenChange(false);
    }
  });

  useEffect(() => {
    if (ctx.modal || !ctx.open) return;

    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => document.removeEventListener("keydown", handleDocumentKeyDown);
  }, [ctx.modal, ctx.open, handleDocumentKeyDown]);

  // Backdrop click detection for modal dialogs.
  const handleClick = useEvent((e: React.MouseEvent<HTMLDialogElement>) => {
    if (!ctx.dismissible) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Only close if the click target is the dialog itself (not its children).
    // When clicking on the backdrop, the target is the <dialog> element, and
    // the click coordinates fall outside the dialog's content rect.
    if (e.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();
    const clickedInside =
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

    if (!clickedInside) {
      ctx.onOpenChange(false);
    }
  });

  // Restore focus to the trigger element when the dialog closes.
  // Track previous open state so we only restore on open→closed transitions,
  // not on the initial mount when open is already false.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (ctx.open) {
      wasOpen.current = true;
    } else if (wasOpen.current) {
      wasOpen.current = false;
      ctx.triggerRef.current?.focus();
    }
  }, [ctx.open, ctx.triggerRef]);

  useIsoEffect(() => {
    if (!props.id) return;
    ctx.setTitleId(props.id);
  }, [props.id]);

  const className = useClassName(providedClassName, state);
  const style = useStyle(providedStyle, state);

  const slot = useSlot({
    slot: render ?? <dialog />,
    ref: useCombinedRefs(ref, transitionRef, dialogRef),
    props: [
      {
        role: "dialog",
        "aria-labelledby": ctx.titleId,
        "aria-describedby": ctx.descriptionId || undefined,
        "aria-modal": ctx.modal || undefined,
      },
      props,
      {
        className,
        style,
        onClick: handleClick,
        onKeyDown: handleEscapeKeyDown,
        [DATA_DIALOG_CONTENT]: "",
        [DATA_MODAL]: ctx.modal ? "true" : "false",
        [DATA_OPEN]: ctx.open || undefined,
        [DATA_CLOSED]: !ctx.open || undefined,
      },
    ],
    state,
  });

  if (!mounted && !keepMounted) return null;

  return slot;
}

export const DialogContent = forwardRef(DialogContentBase);

import { useId, useMemo, useRef, useState } from "react";
import { useControlled } from "../hooks/use-controlled.js";
import { useEvent } from "../hooks/use-event.js";
import { DialogRootProvider, type DialogContextValue } from "./dialog-context.js";
import type { Dialog } from "./dialog.js";

export function DialogRoot({
  open: providedOpen,
  defaultOpen,
  modal: providedModal,
  dismissible: providedDismissible,
  onOpenChange: providedOnOpenChange,
  children,
}: Dialog.Props) {
  const modal = providedModal ?? true;
  const dismissible = providedDismissible ?? true;

  const [open, setOpen] = useControlled({
    controlled: providedOpen,
    default: defaultOpen ?? false,
  });

  const [titleId, setTitleId] = useState(useId());
  const [descriptionId, setDescriptionId] = useState<string | undefined>(undefined);
  const triggerRef = useRef<HTMLElement | null>(null);

  const onOpenChange = useEvent(function onOpenChange(next: boolean) {
    setOpen(next);
    providedOnOpenChange?.(next);
  });

  const contextValue = useMemo<DialogContextValue>(() => {
    return {
      open,
      modal,
      dismissible,
      closeOnEscape: true,
      titleId,
      setTitleId,
      descriptionId,
      setDescriptionId,
      triggerRef,
      onOpenChange,
    };
  }, [open, modal, dismissible, titleId, descriptionId, onOpenChange]);

  return <DialogRootProvider value={contextValue}>{children}</DialogRootProvider>;
}

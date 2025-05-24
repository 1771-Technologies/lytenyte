import { useEffect, useState } from "react";
import { useTransitionEffect } from "./use-transition-effect";
import { bodyScrollEnable, bodyScrollDisable } from "@1771technologies/lytenyte-scroll-lock";

export function useManagedDialog(
  open: boolean,
  onOpenChange: (b: boolean) => void,
  timeEnter: number,
  timeExit: number,
  modal: boolean,
  trapFocus: boolean,
  lockBodyScroll: boolean,
  dismissible: boolean,
) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  const { shouldMount, state } = useTransitionEffect(open, timeEnter, timeExit);

  useEffect(() => {
    if (!dialog) return;

    const controller = new AbortController();
    if (shouldMount) {
      if (!dialog.open) {
        if (modal) dialog.showModal();
        else dialog.show();

        if (lockBodyScroll) bodyScrollDisable(dialog);
      }

      document.addEventListener(
        "keydown",
        (ev) => {
          if (ev.key === "Escape") {
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();

            onOpenChange(false);
          }
        },
        { signal: controller.signal },
      );

      dialog.addEventListener(
        "close",
        (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          ev.stopImmediatePropagation();
        },
        { signal: controller.signal },
      );
    } else {
      dialog.close();
      bodyScrollEnable(dialog);
    }

    return () => controller.abort();
  }, [dialog, lockBodyScroll, modal, onOpenChange, shouldMount]);

  return { shouldMount, ref: setDialog, state };
}

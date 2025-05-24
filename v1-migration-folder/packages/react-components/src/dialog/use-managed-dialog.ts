import { useEffect, useState } from "react";
import { useTransitionEffect } from "./use-transition-effect";

export function useManagedDialog(
  open: boolean,
  onOpenChange: (b: boolean) => void,
  timeEnter: number,
  timeExit: number,
) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  const { shouldMount, state } = useTransitionEffect(open, timeEnter, timeExit);

  console.log(open);
  useEffect(() => {
    if (!dialog) return;

    const controller = new AbortController();
    if (shouldMount) {
      if (!dialog.open) dialog.showModal();

      document.addEventListener("keydown", (ev) => {
        if (ev.key === "Escape") {
          ev.preventDefault();
          ev.stopPropagation();
          ev.stopImmediatePropagation();

          onOpenChange(false);
        }
      });

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
    }

    return () => controller.abort();
  }, [dialog, onOpenChange, shouldMount]);

  return { shouldMount, ref: setDialog, state };
}

import { useEffect, useRef, useState } from "react";
import { useTransitionEffect } from "./use-transition-effect";
import { bodyScrollEnable, bodyScrollDisable } from "@1771technologies/lytenyte-scroll-lock";
import type { FocusTrap } from "@1771technologies/lytenyte-focus-trap";
import { createFocusTrap } from "@1771technologies/lytenyte-focus-trap";
import { tabbable } from "@1771technologies/lytenyte-focus";
import { containsPoint } from "@1771technologies/lytenyte-dom-utils";

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
  const trapRef = useRef<FocusTrap | null>(null);
  const focusCatcherRef = useRef<HTMLDivElement | null>(null);
  const mutationRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (!dialog) return;

    function cleanup() {
      if (mutationRef.current) {
        mutationRef.current.disconnect();
        mutationRef.current = null;
      }
      if (focusCatcherRef.current) {
        focusCatcherRef.current.remove();
        focusCatcherRef.current = null;
      }
      if (trapRef.current) {
        trapRef.current.deactivate();
        trapRef.current = null;
      }
    }

    function handleFocusTrap() {
      if (trapRef.current) {
        trapRef.current.deactivate();
        trapRef.current = null;
      }

      if (trapFocus && dialog) {
        const el = tabbable(dialog);
        if (el.length === 0) {
          const focusCatcher = document.createElement("div");
          focusCatcher.tabIndex = 0;
          dialog.appendChild(focusCatcher);
          focusCatcherRef.current = focusCatcher;
        }
        const mutOb = new MutationObserver(() => {
          const els = tabbable(dialog) as HTMLElement[];

          // We have more than one focusable element, and the focus catch is present. We need to
          // now remove the focus catcher. It may be focused. If it is, we remove it and focus the
          // next element.
          if (els.length > 1 && focusCatcherRef.current) {
            if (document.activeElement === focusCatcherRef.current) {
              const index = els.indexOf(focusCatcherRef.current);
              if (els[index]) {
                const next = (index + 1) % els.length;
                els[next]?.focus();
              }
            }

            if (document.activeElement === dialog) {
              const next = els.filter((el) => el !== focusCatcherRef.current)[0];
              next?.focus();
            }

            focusCatcherRef.current.remove();
            focusCatcherRef.current = null;
          }
          if (els.length === 1 && focusCatcherRef.current) return;

          if (els.length === 0 && !focusCatcherRef.current) {
            const focusCatcher = document.createElement("div");
            focusCatcher.tabIndex = 0;
            dialog.appendChild(focusCatcher);
            focusCatcherRef.current = focusCatcher;
          }
        });

        mutOb.observe(dialog, { childList: true, subtree: true });
        mutationRef.current = mutOb;

        trapRef.current = createFocusTrap(dialog);
        trapRef.current.activate();
      }
    }

    const controller = new AbortController();

    if (shouldMount) {
      if (lockBodyScroll) bodyScrollDisable(dialog);
      else bodyScrollEnable(dialog);

      if (trapFocus && trapRef.current) {
        trapRef.current.activate();
      } else if (!trapFocus && trapRef.current) {
        trapRef.current.deactivate();
      }

      if (dialog.open && trapFocus && !trapRef.current) {
        handleFocusTrap();
      }

      if (!dialog.open) {
        if (modal) dialog.showModal();
        else dialog.show();

        handleFocusTrap();
      }

      if (dismissible) {
        document.addEventListener(
          "click",
          (ev) => {
            const element = document.elementFromPoint(ev.clientX, ev.clientY);
            if (element !== dialog) return;

            if (!containsPoint(dialog, ev.clientX, ev.clientY)) {
              onOpenChange(false);
            }
          },
          { signal: controller.signal },
        );

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
      }

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
      cleanup();

      dialog.close();
      bodyScrollEnable(dialog);
    }

    return () => controller.abort();
  }, [dialog, dismissible, lockBodyScroll, modal, onOpenChange, shouldMount, trapFocus]);

  return { shouldMount, ref: setDialog, state };
}

import { useEffect, useRef, useState } from "react";
import { useTransitionEffect } from "./use-transition-effect";
import { bodyScrollEnable, bodyScrollDisable } from "@1771technologies/lytenyte-scroll-lock";
import type { FocusTrap } from "@1771technologies/lytenyte-focus-trap";
import { createFocusTrap } from "@1771technologies/lytenyte-focus-trap";
import { tabbable } from "@1771technologies/lytenyte-focus";
import { containsPoint, isNodeAttached } from "@1771technologies/lytenyte-dom-utils";

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

    if (!dialog) {
      cleanup();
      return;
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

    if (shouldMount) {
      if (lockBodyScroll) bodyScrollDisable(dialog);
      else bodyScrollEnable(dialog);

      // Update the focus if necessary
      if (trapFocus && trapRef.current) trapRef.current.activate();
      else if (!trapFocus && trapRef.current) trapRef.current.deactivate();
      else if (dialog.open && trapFocus && !trapRef.current) handleFocusTrap();

      // Check if the dialog is open. If it is not, we should open it.
      if (!dialog.open) {
        if (modal) dialog.showModal();
        else dialog.show();

        // When opening the dialog we need to enable focus trap if necessary. The `handleFocusTrap`
        // function can be called even if the trap is already enabled.
        handleFocusTrap();
      }

      const listeners: [string, any][] = [];
      const dismissOnClick = (ev: MouseEvent) => {
        if (!dismissible) return;
        const element = document.elementFromPoint(ev.clientX, ev.clientY);
        if (element !== dialog) return;

        if (!containsPoint(dialog, ev.clientX, ev.clientY)) {
          onOpenChange(false);
        }
      };
      document.addEventListener("click", dismissOnClick);
      listeners.push(["click", dismissOnClick]);

      const dismissOnEscape = (ev: KeyboardEvent) => {
        if (ev.key === "Escape") {
          ev.preventDefault();
          ev.stopPropagation();
          ev.stopImmediatePropagation();

          if (dismissible) onOpenChange(false);
        }
      };
      document.addEventListener("keydown", dismissOnEscape);
      listeners.push(["keydown", dismissOnEscape]);

      const onClose = (ev: Event) => {
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
      };
      dialog.addEventListener("close", onClose);

      return () => {
        bodyScrollEnable(dialog);
        listeners.forEach((c) => document.removeEventListener(c[0], c[1]));
        if (isNodeAttached(dialog)) dialog.removeEventListener("close", onClose);
        cleanup();
      };
    } else {
      cleanup();

      dialog.close();
      bodyScrollEnable(dialog);

      return () => {
        cleanup();
      };
    }
  }, [dialog, dismissible, lockBodyScroll, modal, onOpenChange, shouldMount, trapFocus]);

  return { shouldMount, ref: setDialog, state };
}

import { useEffect, useRef, useState } from "react";
import { useTransitionEffect } from "./use-transition-effect.js";
import { bodyScrollEnable, bodyScrollDisable } from "@1771technologies/lytenyte-scroll-lock";
import type { FocusTrap } from "@1771technologies/lytenyte-focus-trap";
import { createFocusTrap } from "@1771technologies/lytenyte-focus-trap";
import { tabbable } from "@1771technologies/lytenyte-focus";
import {
  containsPoint,
  isNodeAttached,
  isVirtualClick,
} from "@1771technologies/lytenyte-dom-utils";
import type { DialogContext } from "./root.use-dialog.js";

export function useManagedDialog(
  open: boolean,
  onOpenChange: (b: boolean) => void,
  timeEnter: number,
  timeExit: number,
  modal: boolean,
  trapFocus: boolean,
  lockBodyScroll: boolean,
  dismissible: boolean,
  dismissPropagates: boolean,

  initialFocus: string | ((dialog: HTMLDialogElement) => HTMLElement | null) | undefined,
  returnFocus: string | (() => HTMLElement | null) | undefined,
  parent: DialogContext | null,
) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  const { shouldMount, state } = useTransitionEffect(open, timeEnter, timeExit);
  const trapRef = useRef<FocusTrap | null>(null);
  const focusCatcherRef = useRef<HTMLDivElement | null>(null);
  const mutationRef = useRef<MutationObserver | null>(null);

  const focusWhenOpen = useRef<Element | null>(null);

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
      /* v8 ignore next 4 */
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
            /* v8 ignore next 7 */
            if (document.activeElement === focusCatcherRef.current) {
              const index = els.indexOf(focusCatcherRef.current);
              if (els[index]) {
                const next = (index + 1) % els.length;
                els[next]?.focus();
              }
            }

            /* v8 ignore next 4 */
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

        trapRef.current = createFocusTrap(dialog, {
          allowOutsideClick: true,
          escapeDeactivates: false,
          fallbackFocus: () => {
            /* v8 ignore next 1 */
            if (focusCatcherRef.current) focusCatcherRef.current.remove();

            const focusCatcher = document.createElement("div");
            focusCatcher.tabIndex = 0;
            dialog.appendChild(focusCatcher);
            focusCatcherRef.current = focusCatcher;

            return focusCatcherRef.current;
          },
          initialFocus: () => {
            if (typeof initialFocus === "function") return initialFocus(dialog);
            return initialFocus;
          },
        });
        queueMicrotask(() => trapRef.current?.activate());
      }
    }

    if (shouldMount) {
      if (lockBodyScroll) bodyScrollDisable(dialog);
      else bodyScrollEnable(dialog);

      /* v8 ignore next 2 */
      if (trapFocus && trapRef.current) trapRef.current.activate();
      else if (!trapFocus && trapRef.current) trapRef.current.deactivate();
      else if (dialog.open && trapFocus && !trapRef.current) handleFocusTrap();

      // Check if the dialog is open. If it is not, we should open it.
      if (!dialog.open) {
        focusWhenOpen.current = document.activeElement;

        if (modal) dialog.showModal();
        else dialog.show();

        // When opening the dialog we need to enable focus trap if necessary. The `handleFocusTrap`
        // function can be called even if the trap is already enabled.
        handleFocusTrap();
        // If we aren't trapping the focus when initially opening then we won't be setting the initial
        // element to focus via our focus trap. So we need to set it here
        if (!trapFocus) {
          const initial =
            typeof initialFocus === "function"
              ? initialFocus(dialog)
              : initialFocus
                ? dialog.querySelector(initialFocus)
                : null;
          if (initial) (initial as any)?.focus();
          else {
            (tabbable(dialog).at(-1) as any)?.focus();
          }
        }
      }

      const controller = new AbortController();

      const dismiss = () => {
        onOpenChange(false);

        let currentDismiss = dismissPropagates;
        let currentParent = parent;
        while (currentDismiss && currentParent) {
          currentParent.onOpenChange(false);
          currentParent = currentParent.parent;
          currentDismiss = currentParent?.dismissPropagates ?? false;
        }
      };

      // Add the click listener to handle dismissing the dialog. We still add the listener even if the
      // dialog is not dismissible for simplicity. If the dialog is not dismissible then the listener is
      // a no-op.
      const dismissOnClick = (ev: MouseEvent) => {
        // We don't close on virtual clicks - since these are used to trigger other elements potentially.
        // Furthermore, virtual clicks indicate the user is using an assistive technology which provides other
        // ways to close the dialog.
        if (!dismissible || isVirtualClick(ev)) return;

        const element = document.elementFromPoint(ev.clientX, ev.clientY);
        if (element !== dialog) return;

        if (!containsPoint(dialog, ev.clientX, ev.clientY)) dismiss();
      };

      document.addEventListener("click", dismissOnClick, {
        signal: controller.signal,
      });

      // The escape key dismisses the dialog. We don't want it to result in the dialog being dismissed, so
      // we prevent the default. We control the open/close state of the dialog ourselves, hence even if the
      // dialog is cannot be dismissed, we prevent the default.
      const dismissOnEscape = (ev: KeyboardEvent) => {
        if (ev.key === "Escape") {
          ev.preventDefault();
          ev.stopPropagation();
          ev.stopImmediatePropagation();

          if (dismissible) dismiss();
        }
      };
      dialog.addEventListener("keydown", dismissOnEscape, { signal: controller.signal });

      return () => {
        bodyScrollEnable(dialog);
        controller.abort();
        cleanup();
      };
    } else {
      cleanup();

      const elementToReturnFocusTo = returnFocus
        ? typeof returnFocus === "function"
          ? returnFocus()
          : document.querySelector(returnFocus)
        : null;

      if (elementToReturnFocusTo) {
        (elementToReturnFocusTo as any)?.focus();
      } else if (focusWhenOpen.current) {
        if (isNodeAttached(focusWhenOpen.current)) (focusWhenOpen.current as any)?.focus();
      }

      dialog.close();
      bodyScrollEnable(dialog);
    }
  }, [
    dialog,
    dismissPropagates,
    dismissible,
    initialFocus,
    lockBodyScroll,
    modal,
    onOpenChange,
    parent,
    returnFocus,
    shouldMount,
    trapFocus,
  ]);

  return { shouldMount, ref: setDialog, state };
}

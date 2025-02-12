import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type JSX } from "react";
import { refCompat, useCombinedRefs, useEvent } from "@1771technologies/react-utils";
import { handleKeydown } from "./handle-key-down.js";
import { handlePointerDown } from "./handle-pointer-down.js";
import { handleClose } from "./handle-close.js";
import { handleOpen } from "./handle-open.js";
import { getFocusableElements } from "@1771technologies/js-utils";

/**
 * Props for the Dialog component, which provides a modal dialog implementation
 * using the native HTML dialog element. The dialog handles all ARIA attributes,
 * focus management, backdrop clicks, and keyboard interactions automatically.
 *
 * The dialog can be controlled through the `open` and `onOpenChange` props,
 * which work together to manage its visibility state. The dialog will automatically
 * close in response to:
 * - Clicks outside the dialog boundary
 * - Pressing the Escape key
 * - Programmatic calls using onOpenChange
 */
export interface DialogProps {
  /**
   * Controls the visibility state of the dialog.
   * When true, the dialog is shown using showModal().
   * When false, the dialog is closed and removed from the DOM.
   */
  readonly open: boolean;

  /**
   * Callback function triggered when the dialog's open state should change.
   * This is called in response to:
   * - User clicking outside the dialog
   * - User pressing Escape key
   * - Programmatic calls to close the dialog
   *
   * @param next - The new desired open state (false when closing)
   */
  readonly onOpenChange: (next: boolean) => void;
}

function DialogImpl({
  open,
  onOpenChange,
  ref,
  children,
  ...props
}: JSX.IntrinsicElements["dialog"] & DialogProps) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const activeRef = useRef<HTMLElement | null>(null);
  const scrollbarWidthRef = useRef(0);

  // Focus Management Edge Case:
  // Some browser extensions (e.g., Vimium) can manipulate focus in ways that bypass
  // the dialog's focus trap. When these extensions trigger an escape key event:
  // 1. Focus can move outside the dialog (even to elements in parent frames)
  // 2. A subsequent escape press closes the dialog without triggering our keydown listener
  // 3. This results in a state mismatch where the dialog is closed but our `open` prop is true
  //
  // Solution:
  // We track the intended open state and force-reopen the dialog if it's closed unexpectedly.
  // While not ideal, this prevents the component from entering an inconsistent state.
  // This approach handles:
  // - Browser extension interactions
  // - Programmatic closure attempts
  // - Cross-frame focus issues
  const openRef = useRef(open);
  openRef.current = open;

  const handleOpenChange = useEvent((b: boolean) => {
    if (b) {
      onOpenChange(b);
      return;
    }

    const returnFocus = activeRef.current;
    setTimeout(() => {
      if (returnFocus) returnFocus.focus();
    }, 10);

    onOpenChange(b);
  });

  useEffect(() => {
    if (!dialog) return;

    if (!controllerRef.current) {
      const controller = new AbortController();
      const signal = controller.signal;
      controllerRef.current = controller;

      // We listen to the window escape as well to improve compatibility with chrome plugins that
      // alter the behavior of the escape key. This is a real edge the likely will never be
      // encountered. We have to check if the dialog contains the active element. If it does, we
      // will let the dialog's key-handler process the event.
      window.addEventListener(
        "keydown",
        (ev) => {
          if (dialog.contains(document.activeElement)) return;
          handleKeydown(ev, dialog, handleOpenChange);
        },
        { signal: signal },
      );

      dialog.addEventListener("keydown", (ev) => handleKeydown(ev, dialog, handleOpenChange), {
        signal: signal,
      });
      dialog.addEventListener(
        "pointerdown",
        (ev) => handlePointerDown(ev, dialog, handleOpenChange),
        {
          signal,
        },
      );
      dialog.addEventListener(
        "close",
        () => {
          // If the dialog was closed but should be open, force it back open
          // This maintains consistency with our component's open state
          if (openRef.current) {
            dialog.showModal();
            return;
          }
        },
        { signal },
      );
    }

    if (open) handleOpen(dialog, activeRef, scrollbarWidthRef);
    else dialog.close();
  }, [dialog, handleOpenChange, open]);

  useEffect(() => {
    if (!dialog) return;

    const focusableItems = getFocusableElements(dialog);
    setTimeout(() => {
      focusableItems.at(0)?.focus();
    }, 50);
  }, [dialog]);

  // Cleanup Effect:
  // We need to ensure proper cleanup when the dialog closes, regardless of how it was closed.
  // This effect handles cases where:
  // 1. The dialog is removed from DOM before the close event fires
  // 2. State changes occur during unmounting
  // This ensures refs are clean for the next dialog open
  useEffect(() => {
    if (open) return;
    handleClose(controllerRef, activeRef, scrollbarWidthRef);
  }, [dialog, open]);

  const refs = useCombinedRefs(ref, setDialog);
  if (!open) return null;

  return createPortal(
    <dialog ref={refs} {...props}>
      <style>
        {`
          body:has(dialog[open]) {
            overflow: hidden;
            padding-inline-end: var(--scrollbar-width-removed, 0px);
          }
        `}
      </style>
      {children}
    </dialog>,
    document.body,
  );
}

/**
 * A declarative dialog component that provides a modal dialog with proper focus management
 * and keyboard interactions. This component wraps the native HTML dialog element while
 * providing additional functionality for React applications.
 *
 * Key features:
 * - Manages focus trap within the dialog
 * - Handles keyboard interactions (Escape to close)
 * - Prevents scroll on the main document when open
 * - Handles edge cases with browser extensions
 * - Maintains proper focus restoration
 *
 * @example
 * ```tsx
 * <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *   <h1>Dialog Content</h1>
 *   <button onClick={() => setIsOpen(false)}>Close</button>
 * </Dialog>
 * ```
 */
export const Dialog = refCompat(DialogImpl, "Dialog");

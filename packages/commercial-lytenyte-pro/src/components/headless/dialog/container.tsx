import { forwardRef, useEffect, useRef, useState, type JSX, type ReactNode } from "react";
import { useDialogRoot } from "./context.js";
import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  hide,
  inline,
  offset,
  shift,
  type Middleware,
} from "../../external/floating-ui.js";
import { transformOrigin } from "./transform-origin.js";
import { FocusTrap } from "@1771technologies/lytenyte-shared";
import { getActiveElement, getTabbables, SCROLL_LOCKER } from "@1771technologies/lytenyte-shared";
import { useCombinedRefs } from "@1771technologies/lytenyte-core/internal";
import { useTransitioned } from "../../../hooks/use-transitioned-open.js";

function DialogContainerBase(props: DialogContainer.Props, ref: DialogContainer.Props["ref"]) {
  const {
    open,
    onOpenChange,
    onOpenChangeComplete,
    titleId,
    descriptionId,
    focusCanReturn,
    focusCanTrap,
    focusFallback,
    focusInitial,
    focusPreventScroll,
    focusReturn,
    focusTrap,
    lockScroll,
    lightDismiss,
    modal = true,

    anchor,
    alignOffset,
    inline: inlineV,
    placement,
    shiftPadding,
    sideOffset,

    hide: shouldHide,

    arrow: arrowEl,
  } = useDialogRoot();
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);

  const [t, shouldMount] = useTransitioned(open, dialog, onOpenChangeComplete);

  const locked = useRef(false);

  useEffect(() => {
    if (!open || !anchor) return;

    const anchorEl = typeof anchor === "string" ? (document.querySelector(anchor) as HTMLElement) : anchor;

    if (!anchorEl || !dialog) return;

    const middleware: Middleware[] = [offset({ alignmentAxis: alignOffset, mainAxis: sideOffset })];

    if (inlineV) middleware.push(inline({ padding: shiftPadding }));

    const flipMw = flip({
      crossAxis: "alignment",
      fallbackAxisSideDirection: "end",
    });

    const shiftMw = shift({
      padding: shiftPadding,
      mainAxis: true,
    });
    const shiftMwX = shift({
      padding: shiftPadding,
      crossAxis: true,
    });

    if (placement.includes("-")) middleware.push(flipMw, shiftMw, shiftMwX);
    else middleware.push(shiftMw, flipMw, shiftMwX);

    middleware.push(transformOrigin({ arrowHeight: 0, arrowWidth: 0 }));

    if (shouldHide) {
      middleware.push(hide());
    }

    if (arrowEl) middleware.push(arrow({ element: arrowEl, padding: 0 }));

    const clean = autoUpdate(anchorEl, dialog, async () => {
      const pos = await computePosition(anchorEl, dialog, {
        strategy: "fixed",
        placement: placement,
        middleware,
      });

      const hidden = pos.middlewareData.hide?.referenceHidden;

      if (hidden && shouldHide) {
        dialog.style.visibility = "hidden";
      } else {
        dialog.style.visibility = "visible";
      }

      const x = pos.middlewareData.transformOrigin.x;
      const y = pos.middlewareData.transformOrigin.y;

      const anchorBB = anchorEl.getBoundingClientRect();

      Object.assign(dialog.style, {
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        transformOrigin: `${x} ${y}`,
      });

      dialog.style.setProperty("--ln-anchor-width", `${anchorBB.width}px`);
      dialog.style.setProperty("--ln-anchor-height", `${anchorBB.height}px`);

      if (arrowEl) {
        const { x, y } = pos.middlewareData.arrow ?? {};

        const top = y;
        const left = x;

        arrowEl.setAttribute("data-ln-placement", pos.placement.split("-").at(0) ?? "");

        Object.assign(arrowEl.style, {
          left: left != null ? `${left}px` : "",
          top: top != null ? `${top}px` : "",
        });
      }
    });

    return () => clean();
  }, [
    alignOffset,
    anchor,
    arrowEl,
    dialog,
    inlineV,
    open,
    placement,
    shiftPadding,
    shouldHide,
    shouldMount,
    sideOffset,
  ]);

  const lockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (lockScroll == false) return;
    if (lockTimeout.current) clearTimeout(lockTimeout.current);

    if (shouldMount && !locked.current) {
      SCROLL_LOCKER.acquire(null);
      locked.current = true;
    } else if (!shouldMount && locked.current) {
      SCROLL_LOCKER.release();
      locked.current = false;
    }

    return () => {
      lockTimeout.current = setTimeout(() => {
        if (locked.current) SCROLL_LOCKER.release();

        locked.current = false;
        lockTimeout.current = null;
      }, 20);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldMount]);

  const trapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    if (!dialog) return;

    const controller = new AbortController();

    if (shouldMount) {
      dialog.addEventListener(
        "keydown",
        (ev) => {
          if (ev.key === "Escape") {
            // Check if the dialog contains another open dialog
            const otherDialog = dialog.querySelector('[data-ln-light-dismiss="true"]');
            if (otherDialog) return;

            ev.stopPropagation();
            if (lightDismiss != false) onOpenChange(false);
            ev.preventDefault();
          }
        },
        { signal: controller.signal },
      );
    }

    if (shouldMount && lightDismiss != false) {
      document.addEventListener(
        "click",
        (ev) => {
          const bb = dialog.getBoundingClientRect();
          if (ev.button !== 0) return;

          if (ev.target != dialog && dialog.contains(ev.target as HTMLElement)) return;

          // Check if the dialog contains another open dialog
          const otherDialog = dialog.querySelector('[data-ln-light-dismiss="true"]');
          if (otherDialog) return;

          if (
            ev.clientX < bb.left ||
            ev.clientX > bb.right ||
            ev.clientY < bb.top ||
            ev.clientY > bb.bottom
          ) {
            ev.stopPropagation();
            ev.stopImmediatePropagation();

            if (typeof lightDismiss === "function") {
              const res = lightDismiss(ev.target as HTMLElement);
              if (!res) return;
            }
            setTimeout(() => onOpenChange(false));
          }
        },
        { capture: true, signal: controller.signal },
      );
    }

    const options: any = {
      preventScroll: focusPreventScroll,
      checkCanReturnFocus: focusCanReturn,
      checkCanFocusTrap: focusCanTrap,
      fallbackFocus: focusFallback,
      initialFocus: focusInitial,
      setReturnFocus: focusReturn ?? getActiveElement(document),
    };
    Object.keys(options).forEach((c) => {
      if (options[c] === undefined) delete options[c];
    });

    let obsRef: MutationObserver | null = null;
    if (!options.checkCanFocusTrap) {
      const checkCanFocusTrap = (dialog: HTMLElement[]) => {
        const tabbables = getTabbables(dialog[0]);
        if (tabbables.length) return Promise.resolve();

        return new Promise<void>((res) => {
          obsRef = new MutationObserver(() => {
            if (getTabbables(dialog[0])) {
              obsRef?.disconnect();
              res();
            }
          });
          obsRef.observe(dialog[0], { childList: true, subtree: true });
        });
      };

      options.checkCanFocusTrap = checkCanFocusTrap;
    }

    const trap = new FocusTrap(dialog, options);
    trapRef.current = trap;

    if (shouldMount) {
      if (modal != false) dialog.showModal();
      else dialog.showPopover();

      if (focusTrap != false) trap.activate();
    }

    return () => {
      controller.abort();
      trap.deactivate();
      obsRef?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog, shouldMount]);

  // Deactivate and close the dialog if the component will no longer be mounted.
  if (trapRef.current && !shouldMount) {
    trapRef.current.deactivate();
    trapRef.current = null;
  }

  const combined = useCombinedRefs(ref, setDialog as any);

  const Element = (modal != false ? "dialog" : "div") as unknown as (
    props: JSX.IntrinsicElements["dialog"],
  ) => ReactNode;

  if (!shouldMount) return null;

  return (
    <Element
      {...props}
      popover={!modal ? "manual" : undefined}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      data-ln-light-dismiss={lightDismiss != false}
      data-ln-transition={t}
      data-ln-dialog={
        !(props as any)["data-ln-popover"] && !(props as any)["data-ln-menu-popover"] ? true : undefined
      }
      ref={combined}
    >
      {props.children}
    </Element>
  );
}

export const DialogContainer = forwardRef(DialogContainerBase);

export namespace DialogContainer {
  export type Props = JSX.IntrinsicElements["dialog"];
}

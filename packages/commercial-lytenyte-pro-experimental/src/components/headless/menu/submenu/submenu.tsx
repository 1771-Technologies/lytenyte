import { forwardRef, useCallback, useEffect, useMemo, useState, type JSX } from "react";
import type { Placement } from "../../../external/floating-ui.js";
import { useSubmenuPosition } from "./use-submenu-position.js";
import { submenuContext } from "./submenu-context.js";
import { useCombinedRefs, useControlled } from "@1771technologies/lytenyte-core-experimental/internal";
import { useTransitioned } from "../../../../hooks/use-transitioned-open.js";

export interface SubmenuProps {
  readonly open?: boolean;
  readonly onOpenChange?: (b: boolean) => void;
  readonly placement?: Placement;
  readonly shiftPadding?: number;
  readonly sideOffset?: number;
  readonly alignOffset?: number;
}

function SubmenuImpl(
  {
    open: userOpen,
    onOpenChange,
    placement = "right-start",
    shiftPadding,
    sideOffset = 2,
    alignOffset = 0,
    ...props
  }: Submenu.Props,
  ref: Submenu.Props["ref"],
) {
  const [open, setOpen] = useControlled({ controlled: userOpen, default: false });
  const [sub, submenuRef] = useState<HTMLDivElement | null>(null);

  const [, shouldMount] = useTransitioned(open, sub);

  const openChange = useCallback(
    (b: boolean) => {
      setOpen(b);
      onOpenChange?.(b);
    },
    [onOpenChange, setOpen],
  );

  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const combined = useCombinedRefs(ref, setRoot);
  useSubmenuPosition({
    placement,
    shiftPadding,
    sideOffset,
    alignOffset,
    sub,
    root,
  });

  useEffect(() => {
    if (!root) return;

    const controller = new AbortController();
    const signal = controller.signal;
    root.addEventListener(
      "ln-close",
      () => {
        openChange(false);
      },
      { signal },
    );

    return () => controller.abort();
  }, [openChange, root]);

  return (
    <submenuContext.Provider
      value={useMemo(
        () => ({
          submenuRef,
          open: shouldMount,
          onOpenChange: openChange,
        }),
        [openChange, shouldMount],
      )}
    >
      <div
        {...props}
        data-ln-open={open}
        data-ln-submenu-root
        role="menuitem"
        style={{
          ...props.style,
          position: "relative",
        }}
        ref={combined}
        onKeyDown={(ev) => {
          props.onKeyDown?.(ev);
          if (ev.isPropagationStopped()) return;

          if (ev.key === "ArrowLeft") {
            setOpen(false);
            const trigger = ev.currentTarget.querySelector('[data-ln-subtrigger="true"]') as HTMLElement;
            trigger?.focus();
            ev.stopPropagation();
            ev.preventDefault();
          }
        }}
      >
        {props.children}
      </div>
    </submenuContext.Provider>
  );
}

export const Submenu = forwardRef(SubmenuImpl);

export namespace Submenu {
  export type Props = JSX.IntrinsicElements["div"] & {
    readonly open?: boolean;
    readonly onOpenChange?: (b: boolean) => void;
    readonly placement?: Placement;
    readonly shiftPadding?: number;
    readonly sideOffset?: number;
    readonly alignOffset?: number;
  };
}

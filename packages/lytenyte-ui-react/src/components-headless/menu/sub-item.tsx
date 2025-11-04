import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type JSX,
  type ReactNode,
} from "react";
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  type Middleware,
  type Placement,
} from "../../external/floating-ui.js";
import { transformOrigin } from "../dialog/transform-origin.js";
import { subItemContext } from "./sub-item-context.js";
import { useControlled } from "../../hooks/use-controlled.js";
import { useCombinedRefs } from "../../hooks/use-combined-ref.js";
import { mergeProps } from "../../hooks/use-slot/merge-props.js";
import { useTransitioned } from "../../hooks/use-transitioned-open.js";

export interface SubmenuProps {
  readonly open?: boolean;
  readonly onOpenChange?: (b: boolean) => void;
  readonly trigger: ReactNode;
  readonly placement?: Placement;
  readonly shiftPadding?: number;
  readonly sideOffset?: number;
  readonly alignOffset?: number;
}

function SubItemImpl(
  {
    open: userOpen,
    onOpenChange,
    trigger,
    placement = "right-start",
    shiftPadding,
    sideOffset = 2,
    alignOffset = 0,
    ...props
  }: JSX.IntrinsicElements["li"] & SubmenuProps,
  ref: JSX.IntrinsicElements["li"]["ref"],
) {
  const [open, setOpen] = useControlled({ controlled: userOpen, default: false });
  const [active, setActive] = useState(false);
  const [sub, setSub] = useState<HTMLUListElement | null>(null);

  const actionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const merged = mergeProps(props, {
    style: { position: "relative" },
    onFocus: (ev: FocusEvent<HTMLLIElement>) => {
      setActive(true);
      if (actionRef.current) clearTimeout(actionRef.current);
      actionRef.current = null;

      if (ev.currentTarget.contains(ev.target) && !open && ev.currentTarget !== ev.target) {
        onOpenChange?.(true);
        setOpen(true);
      }
    },
    onBlur: () => {
      setActive(false);
      if (actionRef.current) clearTimeout(actionRef.current);
      actionRef.current = setTimeout(() => {
        onOpenChange?.(false);
        setOpen(false);
        actionRef.current = null;
      });
    },
  });

  const [root, setRoot] = useState<HTMLLIElement | null>(null);
  const combined = useCombinedRefs(ref, setRoot);

  useEffect(() => {
    if (!root) return;

    const controller = new AbortController();
    root.addEventListener(
      "ln-hover-open",
      (ev) => {
        if (actionRef.current) clearTimeout(actionRef.current);
        ev.stopPropagation();
        actionRef.current = null;

        if (!open) {
          onOpenChange?.(true);
          setOpen(true);
        }
      },
      { signal: controller.signal },
    );

    root.addEventListener(
      "ln-keyboard-open",
      (ev) => {
        if (actionRef.current) clearTimeout(actionRef.current);
        ev.stopPropagation();
        actionRef.current = null;

        if (!open) {
          onOpenChange?.(true);
          setOpen(true);
        }
      },
      { signal: controller.signal },
    );

    root.addEventListener(
      "ln-keyboard-close",
      (ev) => {
        if (actionRef.current) clearTimeout(actionRef.current);
        ev.stopPropagation();
        actionRef.current = null;

        if (open) {
          onOpenChange?.(false);
          setOpen(false);
        }
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [onOpenChange, open, root, setOpen, sub]);

  const [t, shouldMount] = useTransitioned(open, sub);

  useEffect(() => {
    if (!sub || !open || !root) return;

    const middleware: Middleware[] = [offset({ alignmentAxis: alignOffset, mainAxis: sideOffset })];

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

    const clean = autoUpdate(root, sub, async () => {
      const pos = await computePosition(root, sub, {
        strategy: "fixed",
        placement: placement,
        middleware,
      });

      const x = pos.middlewareData.transformOrigin.x;
      const y = pos.middlewareData.transformOrigin.y;

      sub.style.transformOrigin = `${x} ${y}`;
      sub.style.top = `${pos.y}px`;
      sub.style.left = `${pos.x}px`;
    });

    return () => clean();
  }, [alignOffset, open, placement, root, shiftPadding, sideOffset, sub]);

  return (
    <subItemContext.Provider
      value={useMemo(() => ({ ref: setSub, transition: t, root, submenu: sub }), [root, sub, t])}
    >
      <li
        {...merged}
        data-ln-open={open}
        data-ln-active={active}
        data-ln-menu-item
        data-ln-menu-subtrigger
        tabIndex={0}
        ref={combined}
      >
        {trigger}
        {shouldMount && props.children}
      </li>
    </subItemContext.Provider>
  );
}

export const SubItem = forwardRef(SubItemImpl);

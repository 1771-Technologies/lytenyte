import { useState, useRef, useEffect, type PropsWithChildren, useId } from "react";
import { contextRoot, useTooltipGroup, type TooltipRootContext } from "./context.js";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";

export interface TooltipRootProps {
  readonly onOpenChange?: (open: boolean) => void;
  readonly open?: boolean;

  readonly showDelay?: number;
  readonly hideDelay?: number;

  readonly mountTime?: number;
  readonly unmountTime?: number;

  readonly interactive?: boolean;
}

export const TooltipRoot = ({
  children,
  interactive,
  open: userOpen,
  onOpenChange: userOnOpenChange,
  mountTime = 0,
  unmountTime = 0,
  ...p
}: PropsWithChildren<TooltipRootProps>) => {
  const group = useTooltipGroup();

  const [localOpen, setOpenState] = useState(false);
  const open = userOpen ?? localOpen;

  const groupId = useId();

  const onOpenChange = useEvent((b: boolean) => {
    if (userOnOpenChange) userOnOpenChange(b);
    else setOpenState(b);
  });

  useEffect(() => {
    if (!group || !open) return;

    // We need set the group id to this one
    if (open) {
      group.groupClose.current = () => onOpenChange(false);
      group.setOpenGroupId(groupId);
      group.setGroupOpen(true);
    }

    return () => {
      group.groupClose.current = null;
      group.setOpenGroupId("");
      group.setGroupOpen(false);
    };
  }, [group, groupId, onOpenChange, open]);

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    document.addEventListener(
      "keydown",
      (ev) => {
        if (ev.key === "Escape") onOpenChange(false);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [onOpenChange, open]);

  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const [content, setContent] = useState<HTMLElement | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showDelay = p.showDelay ?? group?.groupShowDelay;
  const hideDelay = p.hideDelay ?? group?.groupHideDelay;

  const beginOpen = useEvent(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (open) return;

    // immediately open this one
    if (group?.groupOpen) {
      group.groupClose.current?.();
      onOpenChange(true);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      onOpenChange(true);
    }, showDelay);
  });
  const beginClose = useEvent(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!open) return;

    timeoutRef.current = setTimeout(() => {
      onOpenChange(false);
    }, hideDelay);
  });

  const contextValue: TooltipRootContext = {
    open,

    trigger,
    triggerRef: setTrigger,
    content,
    contentRef: setContent,

    beginOpen,
    beginClose,
    mountTime,
    unmountTime,

    interactive: interactive ?? false,
  };

  return <contextRoot.Provider value={contextValue}>{children}</contextRoot.Provider>;
};

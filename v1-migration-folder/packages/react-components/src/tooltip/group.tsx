import { useMemo, useRef, useState, type PropsWithChildren } from "react";
import { context, type TooltipGroupContext } from "./context.js";

export interface TooltipGroupProps {
  showDelay?: number;
  hideDelay?: number;
}

export const TooltipGroup = ({
  children,
  showDelay,
  hideDelay,
}: PropsWithChildren<TooltipGroupProps>) => {
  const [groupOpen, setGroupOpen] = useState(false);
  const [openGroupId, setOpenGroupId] = useState("");
  const groupClose = useRef<null | (() => void)>(null);

  const value = useMemo<TooltipGroupContext>(() => {
    return {
      groupOpen,
      setGroupOpen,
      openGroupId,
      setOpenGroupId,
      groupClose,
      groupHideDelay: hideDelay ?? 200,
      groupShowDelay: showDelay ?? 200,
    };
  }, [groupOpen, hideDelay, openGroupId, showDelay]);

  return <context.Provider value={value}>{children}</context.Provider>;
};

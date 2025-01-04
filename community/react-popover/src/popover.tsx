import type { Rect } from "@1771technologies/positioner";
import { Dialog } from "@1771technologies/react-dialog";
import { refCompat } from "@1771technologies/react-utils";
import { useEffect, useState, type JSX, type PropsWithChildren } from "react";

export interface PopoverProps {
  readonly popoverTarget?: HTMLElement | Rect | null;
  readonly open: boolean;
  readonly onOpenChange: (b: boolean) => void;
}

function PopoverImpl({
  open,
  onOpenChange,
  popoverTarget,
  children,
  ref,
  ...props
}: PropsWithChildren<PopoverProps> & JSX.IntrinsicElements["dialog"]) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {}, []);

  if (!popoverTarget) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}

export const Popover = refCompat(PopoverImpl, "Popover");

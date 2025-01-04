import type { Rect } from "@1771technologies/positioner";
import { Dialog } from "@1771technologies/react-dialog";
import { refCompat } from "@1771technologies/react-utils";
import type { JSX, PropsWithChildren } from "react";

export interface PopoverProps {
  readonly popoverTarget: HTMLElement | Rect;
  readonly open: boolean;
  readonly onOpenChange: (b: boolean) => void;
}

function PopoverImpl({
  open,
  onOpenChange,
  children,
}: PropsWithChildren<PopoverProps> & JSX.IntrinsicElements["dialog"]) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}

export const Popover = refCompat(PopoverImpl, "Popover");

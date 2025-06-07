import { DialogClose } from "../dialog/close";
import { DialogDescription } from "../dialog/description";
import { DialogPanel } from "../dialog/panel";
import { DialogPortal } from "../dialog/portal";
import { DialogRoot } from "../dialog/root";
import { DialogTitle } from "../dialog/title";
import { DialogTrigger } from "../dialog/trigger";
import { PopoverPositioner } from "./popover-positioner";

export const Popover = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Title: DialogTitle,
  Description: DialogDescription,
  Panel: DialogPanel,
  Close: DialogClose,
  Positioner: PopoverPositioner,
};

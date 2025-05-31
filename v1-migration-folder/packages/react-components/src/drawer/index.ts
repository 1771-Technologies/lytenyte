import { DialogClose } from "../dialog/close";
import { DialogDescription } from "../dialog/description";
import { DialogPortal } from "../dialog/portal";
import { DialogTitle } from "../dialog/title";
import { DialogTrigger } from "../dialog/trigger";
import { DrawerPanel } from "./panel";
import { DrawerRoot } from "./root";

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DialogTrigger,
  Close: DialogClose,
  Title: DialogTitle,
  Description: DialogDescription,
  Portal: DialogPortal,
  Panel: DrawerPanel,
};

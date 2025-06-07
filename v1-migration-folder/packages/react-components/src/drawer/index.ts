import { DialogClose } from "../dialog/close.js";
import { DialogDescription } from "../dialog/description.js";
import { DialogPortal } from "../dialog/portal.js";
import { DialogTitle } from "../dialog/title.js";
import { DialogTrigger } from "../dialog/trigger.js";
import { DrawerPanel } from "./panel.js";
import { DrawerRoot } from "./root.js";

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DialogTrigger,
  Close: DialogClose,
  Title: DialogTitle,
  Description: DialogDescription,
  Portal: DialogPortal,
  Panel: DrawerPanel,
};

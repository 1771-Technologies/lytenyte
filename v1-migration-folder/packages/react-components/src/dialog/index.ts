import { DialogClose } from "./close.js";
import { DialogDescription } from "./description.js";
import { DialogPanel } from "./panel.js";
import { DialogPortal } from "./portal.js";
import { DialogRoot } from "./root.js";
import { DialogTitle } from "./title.js";
import { DialogTrigger } from "./trigger.js";

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Panel: DialogPanel,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};

export type { DialogApi, DialogRootProps } from "./root.js";

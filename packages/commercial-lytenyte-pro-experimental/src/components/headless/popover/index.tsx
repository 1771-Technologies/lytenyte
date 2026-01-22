import type { PropsWithChildren } from "react";
import { PopoverRoot } from "./root.js";
import { PopoverTrigger } from "./trigger.js";
import { DialogArrow } from "../dialog/arrow.js";
import { DialogClose } from "../dialog/close.js";
import { PopoverContainer } from "./container.js";
import { DialogDescription } from "../dialog/description.js";
import { DialogTitle } from "../dialog/title.js";
import { useDialog } from "../dialog/use-dialog.js";

export const Popover = (props: PropsWithChildren<PopoverRoot.Props>) => <PopoverRoot {...props} />;

Popover.Trigger = PopoverTrigger;
Popover.Arrow = DialogArrow;
Popover.Close = DialogClose;
Popover.Container = PopoverContainer;
Popover.Description = DialogDescription;
Popover.Title = DialogTitle;
Popover.useControls = useDialog;

export namespace Popover {
  export type Props = PopoverRoot.Props;
  export namespace Component {
    export type Trigger = PopoverTrigger.Props;
    export type Arrow = DialogArrow.Props;
    export type Close = DialogClose.Props;
    export type Container = PopoverContainer.Props;
    export type Description = DialogDescription.Props;
    export type Title = DialogTitle.Props;
  }
}

import type { PropsWithChildren } from "react";
import { DialogRoot } from "./root.js";
import { DialogTrigger } from "./trigger.js";
import { DialogArrow } from "./arrow.js";
import { DialogClose } from "./close.js";
import { DialogContainer } from "./container.js";
import { DialogDescription } from "./description.js";
import { DialogTitle } from "./title.js";
import { useDialog } from "./use-dialog.js";

export const Dialog = (props: PropsWithChildren<DialogRoot.Props>) => <DialogRoot {...props} />;

Dialog.Trigger = DialogTrigger;
Dialog.Arrow = DialogArrow;
Dialog.Close = DialogClose;
Dialog.Container = DialogContainer;
Dialog.Description = DialogDescription;
Dialog.Title = DialogTitle;
Dialog.useControls = useDialog;

export namespace Dialog {
  export type Props = DialogRoot.Props;
  export namespace Component {
    export type Trigger = DialogTrigger.Props;
    export type Arrow = DialogArrow.Props;
    export type Close = DialogClose.Props;
    export type Container = DialogContainer.Props;
    export type Description = DialogDescription.Props;
    export type Title = DialogTitle.Props;
  }
}

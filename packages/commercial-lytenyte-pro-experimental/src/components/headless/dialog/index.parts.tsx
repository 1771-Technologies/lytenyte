import type { PropsWithChildren } from "react";
import { DialogRoot } from "./root.jsx";
import { DialogTrigger } from "./trigger.jsx";
import { DialogArrow } from "./arrow.jsx";
import { DialogClose } from "./close.jsx";
import { DialogContainer } from "./container.jsx";
import { DialogDescription } from "./description.jsx";
import { DialogTitle } from "./title.jsx";
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

import { DialogClose, type DialogCloseProps } from "../dialog/close.js";
import { DialogDescription, type DialogDescriptionProps } from "../dialog/description.js";
import { DialogPanel } from "../dialog/panel.js";
import { DialogPortal, type DialogPortalProps } from "../dialog/portal.js";
import { DialogRoot, type DialogRootProps } from "../dialog/root.js";
import { DialogTitle, type DialogTitleProps } from "../dialog/title.js";
import { DialogTrigger, type DialogTriggerProps } from "../dialog/trigger.js";
import type { PositionerProps } from "../positioner/positioner.js";
import { PopoverPositioner } from "./popover-positioner.js";

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

export type PopoverRootProps = DialogRootProps;
export type PopoverTriggerProps = DialogTriggerProps;
export type PopoverPortalProps = DialogPortalProps;
export type PopoverTitleProps = DialogTitleProps;
export type PopoverDescriptionProps = DialogDescriptionProps;
export type PopoverCloseProps = DialogCloseProps;
export type PopoverPositionerProps = PositionerProps;

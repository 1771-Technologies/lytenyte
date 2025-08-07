import { DialogClose, type DialogCloseProps } from "../dialog/close.js";
import { DialogDescription, type DialogDescriptionProps } from "../dialog/description.js";
import { DialogPortal, type DialogPortalProps } from "../dialog/portal.js";
import type { DialogApi } from "../dialog/root.js";
import { DialogTitle, type DialogTitleProps } from "../dialog/title.js";
import { DialogTrigger, type DialogTriggerProps } from "../dialog/trigger.js";
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

export type DrawerApi = DialogApi;
export type { DrawerRootProps } from "./root.js";
export type DrawerTriggerProps = DialogTriggerProps;
export type DrawerCloseProps = DialogCloseProps;
export type DrawerTitleProps = DialogTitleProps;
export type DrawerDescriptionProps = DialogDescriptionProps;
export type DrawerPortalProps = DialogPortalProps;

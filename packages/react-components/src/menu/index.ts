import {
  Popover,
  type PopoverDescriptionProps,
  type PopoverPortalProps,
  type PopoverPositionerProps,
  type PopoverRootProps,
  type PopoverTitleProps,
  type PopoverTriggerProps,
} from "../popover/index.js";
import { MenuCheckboxItem } from "./menu-checkbox-item.js";
import { MenuGroup } from "./menu-group.js";
import { MenuGroupLabel } from "./menu-group-label.js";
import { MenuItem } from "./menu-item.js";
import { MenuPanel } from "./menu-panel.js";
import { MenuRadioGroup } from "./menu-radio-group.js";
import { MenuRadioItem } from "./menu-radio-item.js";
import { MenuRoot } from "./menu-root.js";
import { MenuSubmenuParent } from "./menu-submenu-parent.js";
import { MenuSubmenuRoot } from "./menu-submenu-root.js";
import { MenuSubmenuTrigger } from "./menu-submenu-trigger.js";

export const Menu = {
  Root: Popover.Root,
  Trigger: Popover.Trigger,
  Portal: Popover.Portal,
  Positioner: Popover.Positioner,
  Panel: Popover.Panel,
  Title: Popover.Title,
  Description: Popover.Description,

  MenuRoot: MenuRoot,
  MenuPanel: MenuPanel,
  MenuItem: MenuItem,
  MenuCheckbox: MenuCheckboxItem,
  MenuGroupLabel: MenuGroupLabel,
  MenuGroup: MenuGroup,
  MenuRadio: MenuRadioItem,
  MenuRadioGroup: MenuRadioGroup,
  MenuSubmenuRoot: MenuSubmenuRoot,
  MenuSubmenuTrigger: MenuSubmenuTrigger,
  MenuSubmenuParent: MenuSubmenuParent,
};

export type MenuRootProps = PopoverRootProps;
export type MenuTriggerProps = PopoverTriggerProps;
export type MenuPortalProps = PopoverPortalProps;
export type MenuPositionerProps = PopoverPositionerProps;
export type MenuTitleProps = PopoverTitleProps;
export type MenuDescriptionProps = PopoverDescriptionProps;
export type { MenuRootProps as MenuMenuRootProps } from "./menu-root.js";
export type { MenuPanelProps } from "./menu-panel.js";
export type { MenuCheckboxItemProps, MenuCheckboxItemState } from "./menu-checkbox-item.js";
export type { MenuGroupProps } from "./menu-group.js";
export type { MenuGroupLabelProps } from "./menu-group-label.js";
export type { MenuItemProps } from "./menu-item.js";
export type { MenuRadioGroupProps } from "./menu-radio-group.js";
export type { MenuRadioItemProps, MenuRadioItemState } from "./menu-radio-item.js";
export type { MenuSubmenuParentProps } from "./menu-submenu-parent.js";
export type { MenuSubmenuRootProps } from "./menu-submenu-root.js";
export type { MenuSubmenuTriggerProps } from "./menu-submenu-trigger.js";

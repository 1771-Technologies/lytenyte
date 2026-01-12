import { Popover as P } from "../popover/index.js";
import { MenuPopover } from "./popover.js";
import type { PropsWithChildren } from "react";

import { Item } from "./item/item.js";
import { Container } from "./container.js";
import { CheckboxItem } from "./checkbox-item.js";
import { DialogArrow as Arrow } from "../dialog/arrow.js";
import { RadioGroup } from "./radio-group/context.js";

import { RadioItem } from "./radio-group/radio-item.js";

import { MenuDivider as Divider } from "./menu-divider.js";
import { MenuGroup as Group } from "./menu-group.js";
import { MenuHeader as Header } from "./menu-header.js";

import { ComboOption } from "./combo/combo-option.js";
import { ComboInput } from "./combo/combo-input.js";
import { ComboMenu } from "./combo/combo-menu.js";
import { ComboCheckbox } from "./combo/combo-checkbox.js";

import { Submenu } from "./submenu/submenu.js";
import { SubmenuTrigger } from "./submenu/submenu-trigger.js";

export const Menu = (props: PropsWithChildren<P.Props>) => <P {...props} />;

Menu.Item = Item;
Menu.Container = Container;
Menu.CheckboxItem = CheckboxItem;
Menu.Arrow = Arrow;
Menu.RadioGroup = RadioGroup;
Menu.RadioItem = RadioItem;
Menu.Divider = Divider;
Menu.Group = Group;
Menu.Header = Header;
Menu.ComboOption = ComboOption;
Menu.ComboInput = ComboInput;
Menu.ComboMenu = ComboMenu;
Menu.ComboCheckbox = ComboCheckbox;
Menu.Submenu = Submenu;
Menu.SubmenuTrigger = SubmenuTrigger;
Menu.SubmenuContainer = Container;
Menu.Popover = MenuPopover;
Menu.Title = P.Title;
Menu.Description = P.Description;
Menu.Trigger = P.Trigger;

export namespace Menu {
  export type Props = P.Props;
  export namespace Component {
    export type Item = Item.Props;
    export type Container = Container.Props;
    export type CheckboxItem = CheckboxItem.Props;
    export type Arrow = Arrow.Props;
    export type RadioGroup = RadioGroup.Props;
    export type RadioItem = RadioItem.Props;
    export type Divider = Divider.Props;
    export type Group = Group.Props;
    export type Header = Header.Props;
    export type ComboOption = ComboOption.Props;
    export type ComboInput = ComboInput.Props;
    export type ComboMenu = ComboMenu.Props;
    export type ComboCheckbox = ComboCheckbox.Props;
    export type Submenu = Submenu.Props;
    export type SubmenuTrigger = SubmenuTrigger.Props;
    export type SubmenuContainer = Container.Props;
    export type Popover = MenuPopover.Props;
    export type Title = P.Component.Title;
    export type Description = P.Component.Description;
    export type Trigger = P.Component.Trigger;
  }
}

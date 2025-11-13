import { CheckboxItem } from "./checkbox-item.js";
import { Item } from "./item/item.js";
import { Container } from "./container.js";
import { RadioGroup } from "./radio-group/context.js";
import { RadioItem } from "./radio-group/radio-item.js";
import { Submenu } from "./submenu/submenu.js";
import { SubmenuTrigger } from "./submenu/submenu-trigger.js";
import { Root } from "./root/root.js";
import { Dialog } from "../dialog/dialog.js";
import { MenuTrigger } from "./menu-trigger.js";
import { ComboOption } from "./combo/combo-option.js";
import { ComboInput } from "./combo/combo-input.js";
import { ComboMenu } from "./combo/combo-menu.js";
import { MenuDivider } from "./menu-divider.js";
import { MenuGroup } from "./menu-group.js";
import { MenuHeader } from "./menu-header.js";
import { ComboCheckbox } from "./combo/combo-checkbox.js";

export const Menu = {
  Root,
  Popover: Dialog.Container,
  Container,

  Title: Dialog.Title,
  Description: Dialog.Description,

  Item,
  Arrow: Dialog.Arrow,

  Submenu,
  SubmenuTrigger: SubmenuTrigger,
  SubmenuContainer: Container,

  CheckboxItem: CheckboxItem,

  RadioGroup: RadioGroup,
  RadioItem: RadioItem,

  Trigger: MenuTrigger,

  ComboMenu,
  ComboInput,
  ComboOption,
  ComboCheckbox,

  Divider: MenuDivider,
  Group: MenuGroup,
  Header: MenuHeader,
};

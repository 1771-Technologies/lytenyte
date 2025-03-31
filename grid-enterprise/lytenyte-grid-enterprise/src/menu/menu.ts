import "./menu.css";
import {
  MenuContainer,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuItem,
  MenuSeparator,
  MenuArrow,
  MenuGroup,
  MenuGroupLabel,
  MenuCheckboxItem,
  MenuCheckboxItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRadioItemIndicator,
} from "./menu-impl.js";
import type { Menu as B } from "@base-ui-components/react/menu";

export const Menu = {
  Container: MenuContainer,
  Submenu: MenuSubmenu,
  SubmenuTrigger: MenuSubmenuTrigger,
  Item: MenuItem,
  Separator: MenuSeparator as typeof B.Separator,
  Arrow: MenuArrow,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  RadioGroup: MenuRadioGroup as typeof B.RadioGroup,
  Radio: MenuRadioItem,
  RadioIndicator: MenuRadioItemIndicator,
  Checkbox: MenuCheckboxItem,
  CheckboxIndicator: MenuCheckboxItemIndicator,
};

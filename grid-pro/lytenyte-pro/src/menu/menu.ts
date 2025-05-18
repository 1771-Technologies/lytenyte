import "./menu.css";
import {
  MenuContainer,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuItem,
  MenuSeparator,
  MenuGroup,
  MenuGroupLabel,
  MenuCheckboxItem,
  MenuCheckboxItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRadioItemIndicator,
  MenuPositioner,
  SubmenuPositioner,
} from "./menu-impl.js";
import type { Menu as B } from "@base-ui-components/react/menu";

export const Menu = {
  Container: MenuContainer,
  Submenu: MenuSubmenu,
  SubmenuTrigger: MenuSubmenuTrigger,
  SubmenuPositioner: SubmenuPositioner,
  Item: MenuItem,
  Separator: MenuSeparator as typeof B.Separator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  RadioGroup: MenuRadioGroup as typeof B.RadioGroup,
  Radio: MenuRadioItem,
  RadioIndicator: MenuRadioItemIndicator,
  Checkbox: MenuCheckboxItem,
  CheckboxIndicator: MenuCheckboxItemIndicator,
  Positioner: MenuPositioner,
};

import "./menu.css";
import * as M from "./menu-impl.js";
import type { Menu as B } from "@base-ui-components/react/menu";

export const Menu = {
  Container: M.MenuContainer,
  Submenu: M.MenuSubmenu,
  SubmenuTrigger: M.MenuSubmenuTrigger,
  Item: M.MenuItem,
  Separator: M.MenuSeparator as typeof B.Separator,
  Arrow: M.MenuArrow,
  Group: M.MenuGroup,
  GroupLabel: M.MenuGroupLabel,
  RadioGroup: M.MenuRadioGroup as typeof B.RadioGroup,
  Radio: M.MenuRadioItem,
  RadioIndicator: M.MenuRadioItemIndicator,
  Checkbox: M.MenuCheckboxItem,
  CheckboxIndicator: M.MenuCheckboxItemIndicator,
};

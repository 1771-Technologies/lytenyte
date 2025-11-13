import { Menu as M } from "../../components-headless/menu/index.js";
import { Arrow } from "./arrow.js";
import { CheckboxItem } from "./checkbox-item.js";
import { ComboCheckbox } from "./combo-checkbox.js";
import { ComboInput } from "./combo-input.js";
import { ComboMenu } from "./combo-menu.js";
import { ComboOption } from "./combo-option.js";
import { Divider } from "./divider.js";
import { Header } from "./header.js";
import { Item } from "./item.js";
import { Popover } from "./popover.js";
import { RadioItem } from "./radio-item.js";
import { SubmenuContainer } from "./submenu-container.js";
import { SubmenuTrigger } from "./submenu-trigger.js";
import { Trigger } from "./trigger.js";

const { Container, RadioGroup, Root, Submenu, Group } = M;

export const Menu = {
  Title: M.Title,
  Description: M.Description,

  Root,
  Popover,
  Container,

  Arrow,
  Item,

  Submenu,
  SubmenuTrigger,
  SubmenuContainer,

  CheckboxItem,

  RadioGroup,
  RadioItem,
  Trigger,

  ComboMenu,
  ComboInput,
  ComboOption,
  ComboCheckbox,

  Divider,
  Group,
  Header,
};

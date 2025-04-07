import "./popover.css";

import {
  PopoverArrow,
  PopoverBackdrop,
  PopoverClose,
  PopoverDescription,
  PopoverPopup,
  PopoverPositioner,
  PopoverTitle,
} from "./popover-impl.js";
import type { Popover as P } from "@base-ui-components/react/popover";

export const Popover = {
  Arrow: PopoverArrow as typeof P.Arrow,
  Backdrop: PopoverBackdrop as typeof P.Backdrop,
  Close: PopoverClose as typeof P.Close,
  Description: PopoverDescription as typeof P.Description,
  Container: PopoverPopup as typeof P.Popup,
  Positioner: PopoverPositioner as typeof P.Positioner,
  Title: PopoverTitle as typeof P.Title,
};

import "./dialog.css";
import {
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "./dialog-impl";
import type { Dialog as D } from "@base-ui-components/react/dialog";

export const Dialog = {
  Backdrop: DialogBackdrop as typeof D.Backdrop,
  Close: DialogClose as typeof D.Close,
  Description: DialogDescription as typeof D.Description,
  Container: DialogPopup as typeof D.Popup,
  Title: DialogTitle as typeof D.Title,
};

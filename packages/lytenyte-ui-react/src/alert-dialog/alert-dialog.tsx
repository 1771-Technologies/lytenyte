import type { JSX } from "react";
import type { ClassNameWithState, SlotComponent, StyleWithState } from "../type.js";
import { DialogTrigger } from "../dialog/dialog-trigger.js";
import { DialogTitle } from "../dialog/dialog-title.js";
import { DialogDescription } from "../dialog/dialog-description.js";
import { AlertDialogRoot } from "./alert-dialog-root.js";
import { AlertDialogContent } from "./alert-dialog-content.js";
import { AlertDialogCancel } from "./alert-dialog-cancel.js";
import { AlertDialogAction } from "./alert-dialog-action.js";

export const AlertDialog = {
  Root: AlertDialogRoot,
  Trigger: DialogTrigger,
  Content: AlertDialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Cancel: AlertDialogCancel,
  Action: AlertDialogAction,
};

export namespace AlertDialog {
  export interface State {
    readonly open: boolean;
    readonly modal: boolean;
  }

  export type Props = {
    /**
     * The controlled open state of the alert dialog.
     */
    readonly open?: boolean;

    /**
     * The default open state when uncontrolled.
     *
     * @default false
     */
    readonly defaultOpen?: boolean;

    /**
     * Event handler called when the alert dialog open state changes.
     */
    readonly onOpenChange?: (open: boolean) => void;

    readonly children?: React.ReactNode;
  };

  export namespace Content {
    export type Props = Omit<JSX.IntrinsicElements["dialog"], "className" | "style"> & {
      /**
       * Whether to keep the content mounted in the DOM when the dialog is closed.
       *
       * @default false
       */
      readonly keepMounted?: boolean;

      /**
       * Event handler called when the open or close animation has fully completed.
       */
      readonly onOpenChangeComplete?: (open: boolean) => void;

      /**
       * Inline styles applied to the content element, or a function that returns inline styles
       * based on the dialog's state.
       */
      readonly style?: StyleWithState<State>;

      /**
       * CSS classes applied to the content element, or a function that returns classes based
       * on the dialog's state.
       */
      readonly className?: ClassNameWithState<State>;

      /**
       * Override the default element that is rendered by the alert dialog content.
       *
       * @default <dialog />
       */
      readonly render?: SlotComponent<State>;
    };
  }

  export namespace Cancel {
    export type Props = JSX.IntrinsicElements["button"] & {
      /**
       * Inline styles applied to the cancel button, or a function that returns inline styles
       * based on the dialog's state.
       */
      readonly style?: StyleWithState<State>;

      /**
       * CSS classes applied to the cancel button, or a function that returns classes based
       * on the dialog's state.
       */
      readonly className?: ClassNameWithState<State>;

      /**
       * Override the default element that is rendered by the cancel button.
       *
       * @default <button />
       */
      readonly render?: SlotComponent<State>;
    };
  }

  export namespace Action {
    export type Props = JSX.IntrinsicElements["button"] & {
      /**
       * Inline styles applied to the action button, or a function that returns inline styles
       * based on the dialog's state.
       */
      readonly style?: StyleWithState<State>;

      /**
       * CSS classes applied to the action button, or a function that returns classes based
       * on the dialog's state.
       */
      readonly className?: ClassNameWithState<State>;

      /**
       * Override the default element that is rendered by the action button.
       *
       * @default <button />
       */
      readonly render?: SlotComponent<State>;
    };
  }
}

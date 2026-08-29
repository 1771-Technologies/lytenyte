import type { JSX } from "react";
import type { ClassNameWithState, SlotComponent, StyleWithState } from "../type.js";
import { DialogRoot } from "./dialog-root.js";
import { DialogTrigger } from "./dialog-trigger.js";
import { DialogContent } from "./dialog-content.js";
import { DialogTitle } from "./dialog-title.js";
import { DialogDescription } from "./dialog-description.js";
import { DialogClose } from "./dialog-close.js";

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};

export namespace Dialog {
  export interface State {
    readonly open: boolean;
    readonly modal: boolean;
  }

  export type Props = {
    /**
     * The controlled open state of the dialog.
     */
    readonly open?: boolean;

    /**
     * The default open state when uncontrolled.
     *
     * @default false
     */
    readonly defaultOpen?: boolean;

    /**
     * Whether the dialog is modal. Modal dialogs use `showModal()` and trap focus.
     * Non-modal dialogs use `show()`.
     *
     * @default true
     */
    readonly modal?: boolean;

    /**
     * Whether the dialog can be dismissed by clicking the backdrop.
     * Escape always closes the dialog regardless of this setting.
     *
     * @default true
     */
    readonly dismissible?: boolean;

    /**
     * Event handler called when the dialog open state changes.
     */
    readonly onOpenChange?: (open: boolean) => void;

    readonly children?: React.ReactNode;
  };

  export namespace Trigger {
    export type Props = JSX.IntrinsicElements["button"] & {
      /**
       * Inline styles applied to the trigger element, or a function that returns inline styles
       * based on the dialog's state.
       */
      readonly style?: StyleWithState<State>;

      /**
       * CSS classes applied to the trigger element, or a function that returns classes based
       * on the dialog's state.
       */
      readonly className?: ClassNameWithState<State>;

      /**
       * Override the default element that is rendered by the dialog trigger.
       *
       * @default <button />
       */
      readonly render?: SlotComponent<State>;
    };
  }

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
       * Override the default element that is rendered by the dialog content.
       *
       * @default <dialog />
       */
      readonly render?: SlotComponent<State>;
    };
  }

  export namespace Title {
    export type Props = JSX.IntrinsicElements["h2"] & {
      /**
       * Inline styles applied to the title element, or a function that returns inline styles
       * based on the dialog's state.
       */
      readonly style?: StyleWithState<State>;

      /**
       * CSS classes applied to the title element, or a function that returns classes based
       * on the dialog's state.
       */
      readonly className?: ClassNameWithState<State>;

      /**
       * Override the default element that is rendered by the dialog title.
       *
       * @default <h2 />
       */
      readonly render?: SlotComponent<State>;
    };
  }

  export namespace Description {
    export type Props = JSX.IntrinsicElements["p"] & {
      /**
       * Inline styles applied to the description element, or a function that returns inline styles
       * based on the dialog's state.
       */
      readonly style?: StyleWithState<State>;

      /**
       * CSS classes applied to the description element, or a function that returns classes based
       * on the dialog's state.
       */
      readonly className?: ClassNameWithState<State>;

      /**
       * Override the default element that is rendered by the dialog description.
       *
       * @default <p />
       */
      readonly render?: SlotComponent<State>;
    };
  }

  export namespace Close {
    export type Props = JSX.IntrinsicElements["button"] & {
      /**
       * Inline styles applied to the close element, or a function that returns inline styles
       * based on the dialog's state.
       */
      readonly style?: StyleWithState<State>;

      /**
       * CSS classes applied to the close element, or a function that returns classes based
       * on the dialog's state.
       */
      readonly className?: ClassNameWithState<State>;

      /**
       * Override the default element that is rendered by the dialog close button.
       *
       * @default <button />
       */
      readonly render?: SlotComponent<State>;
    };
  }
}

import type { JSX } from "react";
import { forwardRef, useMemo } from "react";
import type { EventWithDetails, ClassNameWithState, SlotComponent, StyleWithState } from "../type.js";
import { useSlot } from "../hooks/use-slot.js";
import { useControlled } from "../hooks/use-controlled.js";
import type { AccordionContextValue } from "./accordion-context.js";
import { AccordionRootProvider } from "./accordion-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";

function AccordionImpl<T = any>(
  {
    render,
    collapsible,
    value: providedValue,
    hiddenUntilFound,
    disabled: providedDisabled,
    // multiple,
    // loopFocus,
    orientation: providedOrientation,
    style: providedStyle,
    className: providedClassName,
    // keepMounted,
    // onValueChange,
    ...props
  }: Accordion.Props<T>,
  forwarded: Accordion.Props<T>["ref"],
) {
  const [value, _setValue] = useControlled({ controlled: providedValue, default: [] });
  const disabled = providedDisabled ?? false;
  const orientation = providedOrientation ?? "vertical";

  const state = useMemo<Accordion.State>(() => {
    return { value, disabled, orientation };
  }, [value, disabled, orientation]);

  const className = useClassName(providedClassName, state);
  const style = useStyle(providedStyle, state);

  const slot = useSlot<Accordion.State<T>>({
    slot: render ?? <div />,
    props: [{ className, style }, props],
    ref: forwarded,
    state: state,
  });

  const contextValue = useMemo<AccordionContextValue>(() => {
    return {
      collapsible: collapsible ?? false,
      disabled: disabled,
      hiddenUntilFound: hiddenUntilFound ?? false,
    };
  }, [collapsible, disabled, hiddenUntilFound]);

  return <AccordionRootProvider value={contextValue}>{slot}</AccordionRootProvider>;
}

export const Accordion = forwardRef(AccordionImpl);

export namespace Accordion {
  export type AccordionOrientation = "vertical" | "horizontal";
  export interface State<T = any> {
    readonly value: T[];
    readonly disabled: boolean;
    readonly orientation: AccordionOrientation;
  }

  export interface ChangeEventDetails {}
  export interface FocusChangeEventDetails {}

  export type Props<T = any> = Omit<JSX.IntrinsicElements["div"], "className" | "style"> & {
    /**
     * Override the default element that is rendered by the accordion root.
     * The slot element provided must accept a valid ref attribute.
     *
     * Accepts a `ReactElement` or a function that
     * will given the accordion state and returns a `ReactElement`
     *
     * @default <div />
     */
    readonly render?: SlotComponent<State<T>>;

    /**
     * Whether an accordion item can be closed after it has been expanded. Setting the
     * `collapsible` property on the root level changes the default for all accordion items.
     *
     * @default false
     */
    readonly collapsible?: boolean;

    /**
     * The initial value of the expanded accordion items. Use when you want to set the initial
     * state of the accordion but do not want to control state updates.
     */
    readonly defaultValue?: T[];

    /**
     * The controlled value of the accordion. If this value is set, then the `defaultValue` property
     * will be ignored. Use this property when you want to have direct control over the accordion state.
     *
     * Set the `onValueChange` property to handle accordion expansion changes.
     */
    readonly value?: T[];

    /**
     * Allows the browser's built-in page search to find and expand the panel contents. Overrides
     * the `keepMounted` prop and uses the `hidden="until-found"` property to hide the element without
     * removing it from the DOM.
     *
     * To learn more about the `hidden` property see
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden)
     *
     * @default false
     */
    readonly hiddenUntilFound?: boolean;

    /**
     * Whether the accordion items can receive user interaction. Setting disabled on the Accordion root will apply
     * to all items, however individual items may override the setting by setting their own
     * disable state.
     *
     * @default false
     */
    readonly disabled?: boolean;

    /**
     * Whether multiple items can be open at the same time.
     *
     * If the `value` property is set with multiple items, whilst `multiple` is `false`, the accordion
     * will respect the `value` property and display multiple open accordions. However, subsequent
     * expansion changes will collapse/expand accordions to ensure only a single item is open.
     *
     * For the most predictable result only use `multiple` if your application logic can handle
     * `value` states that contain more than a single item.
     *
     * @default false
     */
    readonly multiple?: boolean;

    /**
     * Whether to cycle through accordion items when using the arrow keys to navigate the accordion.
     *
     * @default true
     */
    readonly loopFocus?: boolean;

    /**
     * The visual orientation of the accordion. Controls whether the roving focus uses left/right
     * or up/down arrow keys.
     *
     * @default "vertical"
     */
    readonly orientation?: "horizontal" | "vertical";

    /**
     * Inline styles applied to the root accordion element, or a function that returns inline styled
     * based on the Accordion's state.
     */
    readonly style?: StyleWithState<State>;

    /**
     * CSS classes applied to the root accordion element, or a function that returns classes based
     * on the Accordion's state.
     */
    readonly className?: ClassNameWithState<State>;

    /**
     * Whether to mount the element in the DOM while the panel is closed. This property is ignored
     * when `hiddenUntilFound` is set to `true`.
     */
    readonly keepMounted?: boolean;

    /**
     * Event handler called when an accordion item is expanded or collapsed. Provides the new
     * accordion value state when called.
     */
    readonly onValueChange?: EventWithDetails<T[], ChangeEventDetails>;
  };

  export namespace Item {
    export interface State {}
    export interface OpenChangeEventDetails {}

    export type Props<T = any> = Omit<JSX.IntrinsicElements["div"], "className" | "style"> & {
      /**
       * The value associated with this accordion item. The value should be unique among all
       * the accordion items. If the value is present in the Root's `value` the accordion will be
       * expanded.
       */
      readonly value?: T;

      /**
       * Event handler called when the open state of this accordion item changes. Provides
       * the new open state as a boolean when called.
       */
      readonly onOpenChange?: EventWithDetails<boolean, OpenChangeEventDetails>;

      /**
       * Whether the accordion item can receive user interaction. Overrides the `disabled`
       * setting from the accordion root for this specific item.
       *
       * @default false
       */
      readonly disabled?: boolean;

      /**
       * Inline styles applied to the item element, or a function that returns inline styles
       * based on the item's state.
       */
      readonly style?: StyleWithState<State>;

      /**
       * CSS classes applied to the item element, or a function that returns classes based
       * on the item's state.
       */
      readonly className?: ClassNameWithState<State>;

      /**
       * Override the default element that is rendered by the accordion item.
       * The slot element provided must accept a valid ref attribute.
       *
       * Accepts a `ReactElement` or a function that
       * will given the item state and returns a `ReactElement`.
       *
       * @default <div />
       */
      readonly render: SlotComponent<State>;
    };
  }

  export namespace Header {
    export interface State {}

    export type Props = JSX.IntrinsicElements["h3"] & {
      /**
       * Inline styles applied to the header element, or a function that returns inline styles
       * based on the header's state.
       */
      readonly style?: StyleWithState<State>;

      /**
       * CSS classes applied to the header element, or a function that returns classes based
       * on the header's state.
       */
      readonly className?: ClassNameWithState<State>;

      /**
       * Override the default element that is rendered by the accordion header.
       * The slot element provided must accept a valid ref attribute.
       *
       * Accepts a `ReactElement` or a function that
       * will given the header state and returns a `ReactElement`.
       *
       * @default <h3 />
       */
      readonly render: SlotComponent<State>;
    };
  }

  export namespace Trigger {
    export interface State {}

    export type Props = JSX.IntrinsicElements["button"] & {
      /**
       * Inline styles applied to the trigger element, or a function that returns inline styles
       * based on the trigger's state.
       */
      readonly style?: StyleWithState<State>;

      /**
       * CSS classes applied to the trigger element, or a function that returns classes based
       * on the trigger's state.
       */
      readonly className?: ClassNameWithState<State>;

      /**
       * Override the default element that is rendered by the accordion trigger.
       * The slot element provided must accept a valid ref attribute.
       *
       * Accepts a `ReactElement` or a function that
       * will given the trigger state and returns a `ReactElement`.
       *
       * @default <button />
       */
      readonly render: SlotComponent<State>;
    };
  }

  export namespace Panel {
    export interface State {}

    export type Props = JSX.IntrinsicElements["div"] & {
      /**
       * Allows the browser's built-in page search to find and expand the panel contents. Overrides
       * the `keepMounted` prop and uses the `hidden="until-found"` property to hide the element without
       * removing it from the DOM. Overrides the root-level `hiddenUntilFound` setting for this specific panel.
       *
       * @default false
       */
      readonly hiddenUntilFound?: boolean;

      /**
       * Whether to keep the panel element mounted in the DOM while it is closed. This property
       * is ignored when `hiddenUntilFound` is set to `true`. Overrides the root-level `keepMounted`
       * setting for this specific panel.
       *
       * @default false
       */
      readonly keepMounted?: boolean;

      /**
       * Inline styles applied to the panel element, or a function that returns inline styles
       * based on the panel's state.
       */
      readonly style?: StyleWithState<State>;

      /**
       * CSS classes applied to the panel element, or a function that returns classes based
       * on the panel's state.
       */
      readonly className?: ClassNameWithState<State>;

      /**
       * Override the default element that is rendered by the accordion panel.
       * The slot element provided must accept a valid ref attribute.
       *
       * Accepts a `ReactElement` or a function that
       * will given the panel state and returns a `ReactElement`.
       *
       * @default <div />
       */
      readonly render: SlotComponent<State>;
    };
  }
}

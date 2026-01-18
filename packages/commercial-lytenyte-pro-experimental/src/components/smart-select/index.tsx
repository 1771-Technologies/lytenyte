import type { JSX } from "react";
import type { Popover } from "../headless/popover";
import { Chip, type ChipProps } from "./chip.js";
import { SmartSelectContainer } from "./container.js";
import { Option } from "./option.js";
import type { SmartSelectRootProps } from "./root";
import { SmartSelectRoot } from "./root.js";
import { BasicSelectTrigger } from "./triggers/basic-trigger.js";
import { ComboTrigger } from "./triggers/combo-trigger.js";
import { MultiComboTrigger, type MultiComboTriggerProps } from "./triggers/multi-combo-trigger.js";
import { MultiTrigger, type MultiTriggerProps } from "./triggers/multi-trigger.js";
import type { BaseOption } from "./type";

export const SmartSelect = <T extends BaseOption>(props: SmartSelectRootProps<T>) => (
  <SmartSelectRoot {...props} />
);

SmartSelect.Container = SmartSelectContainer;
SmartSelect.Chip = Chip;
SmartSelect.BasicTrigger = BasicSelectTrigger;
SmartSelect.MultiTrigger = MultiTrigger;
SmartSelect.ComboTrigger = ComboTrigger;
SmartSelect.MultiComboTrigger = MultiComboTrigger;
SmartSelect.Option = Option;

export namespace SmartSelect {
  export type Props<T extends BaseOption> = SmartSelectRootProps<T>;

  export namespace Component {
    export type Container = Popover.Component.Container;
    export type Chip<T extends BaseOption> = ChipProps<T>;
    export type BasicTrigger = JSX.IntrinsicElements["button"];
    export type MultiTrigger = MultiTriggerProps;
    export type ComboTrigger = JSX.IntrinsicElements["input"];
    export type MultiComboTrigger = MultiComboTriggerProps;
  }
}

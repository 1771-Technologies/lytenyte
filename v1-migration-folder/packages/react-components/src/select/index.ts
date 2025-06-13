import type { PortalProps } from "../portal/portal.js";
import type { PositionerProps } from "../positioner/positioner.js";
import { SelectClear } from "./select-clear.js";
import { SelectInput } from "./select-input.js";
import { SelectOption } from "./select-item.js";
import { SelectOptions } from "./select-options.js";
import { SelectPortal } from "./select-portal.js";
import { SelectPositioner } from "./select-positioner.js";
import { SelectRoot } from "./select-root.js";
import { SelectToggle } from "./select-toggle.js";
import { useSelect } from "./use-select.js";

export const Select = {
  Root: SelectRoot,
  Clear: SelectClear,
  Toggle: SelectToggle,
  Input: SelectInput,
  Options: SelectOptions,
  Option: SelectOption,
  Portal: SelectPortal,
  Positioner: SelectPositioner,

  useSelect: useSelect,
};

export type { SelectRootProps } from "./select-root.js";
export type { SelectClearProps } from "./select-clear.js";
export type { SelectToggleProps } from "./select-toggle.js";
export type { SelectOptionsProps } from "./select-options.js";
export type { SelectOptionProps } from "./select-item.js";
export type { UseSelectArgs, SelectItem } from "./use-select.js";
export type SelectPositionerProps = PositionerProps;
export type SelectPortalProps = PortalProps;

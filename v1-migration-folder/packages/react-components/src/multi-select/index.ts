import type { PortalProps } from "../portal/portal.js";
import type { PositionerProps } from "../positioner/positioner.js";
import { MultiSelectClear } from "./multi-select-clear.js";
import { MultiSelectLabel } from "./multi-select-label.js";
import { MultiSelectOption } from "./multi-select-option.js";
import { MultiSelectOptions } from "./multi-select-options.js";
import { MultiSelectPanel } from "./multi-select-panel.js";
import { MultiSelectPortal } from "./multi-select-portal.js";
import { MultiSelectPositioner } from "./multi-select-positioner.js";
import { MultiSelectRoot } from "./multi-select-root.js";
import { MultiSelectTag } from "./multi-select-tag.js";
import { MultiSelectToggle } from "./multi-select-toggle.js";
import { useMultiSelectDrop } from "./use-multi-select-drop.js";
import { useMultiSelect } from "./use-multi-select.js";

export const MultiSelect = {
  Root: MultiSelectRoot,
  Clear: MultiSelectClear,
  Toggle: MultiSelectToggle,
  Label: MultiSelectLabel,
  Option: MultiSelectOption,
  Options: MultiSelectOptions,
  Portal: MultiSelectPortal,
  Positioner: MultiSelectPositioner,
  Tag: MultiSelectTag,
  Panel: MultiSelectPanel,

  useMultiSelect,
  useMultiSelectDrop,
};

export type { MultiSelectClearProps } from "./multi-select-clear.js";
export type { MultiSelectLabelProps } from "./multi-select-label.js";
export type { MultiSelectOptionProps } from "./multi-select-option.js";
export type { MultiSelectOptionsProps } from "./multi-select-options.js";
export type { MultiSelectPanelProps } from "./multi-select-panel.js";
export type MultiSelectPortalProps = PortalProps;
export type MultiSelectPositionerProps = PositionerProps;
export type { MultiSelectRootProps } from "./multi-select-root.js";
export type { MultiSelectTagProps } from "./multi-select-tag.js";
export type { MultiSelectToggleProps } from "./multi-select-toggle.js";
export type { MultiSelectItem, UseMultiSelectArgs } from "./use-multi-select.js";

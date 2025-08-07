import type { PortalProps } from "../portal/portal.js";
import type { PositionerProps } from "../positioner/positioner.js";
import { DropComboClear } from "./drop-combo-clear.js";
import { DropComboInput } from "./drop-combo-input.js";
import { DropComboOption } from "./drop-combo-option.js";
import { DropComboOptions } from "./drop-combo-options.js";
import { DropComboPortal } from "./drop-combo-portal.js";
import { DropComboPositioner } from "./drop-combo-positioner.js";
import { DropComboRoot } from "./drop-combo-root.js";
import { DropComboToggle } from "./drop-combo-toggle.js";
import { useDropCombo } from "./use-drop-combo.js";

export const DropCombo = {
  Root: DropComboRoot,
  Toggle: DropComboToggle,
  Portal: DropComboPortal,
  Positioner: DropComboPositioner,
  Options: DropComboOptions,
  Option: DropComboOption,
  Input: DropComboInput,
  Clear: DropComboClear,

  useDropCombo: useDropCombo,
};

export type { DropComboClearProps } from "./drop-combo-clear.js";
export type { DropComboOptionProps } from "./drop-combo-option.js";
export type { DropComboOptionsProps } from "./drop-combo-options.js";
export type DropComboPortalProps = PortalProps;
export type DropComboPositionerProps = PositionerProps;
export type { DropComboRootProps } from "./drop-combo-root.js";
export type { DropComboToggleProps } from "./drop-combo-toggle.js";
export type { UseDropComboArgs, DropItem } from "./use-drop-combo.js";

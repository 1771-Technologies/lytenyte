import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useTreeItemContext } from "./context.js";

export interface InclusionCheckbox {
  readonly as?: SlotComponent<{
    checked: boolean;
    indeterminate: boolean;
    toggle: (s?: boolean) => void;
  }>;
}

export const InclusionCheckbox = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & InclusionCheckbox
>(function InclusionCheckbox({ as, ...props }, forwarded) {
  const { isChecked, onCheckChange, isIndeterminate } = useTreeItemContext();

  const rendered = useSlot({
    props: [props],
    ref: forwarded,
    state: { checked: isChecked, toggle: onCheckChange, indeterminate: isIndeterminate },
    slot: as ?? (
      <input
        type="checkbox"
        checked={isChecked}
        aria-label="visibility toggle"
        onChange={() => onCheckChange()}
      />
    ),
  });

  return rendered;
});

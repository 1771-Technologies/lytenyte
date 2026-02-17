import { forwardRef, type JSX } from "react";
import { useSlot, type SlotComponent } from "../../hooks/use-slot/index.js";
import { useControlled, useEvent } from "@1771technologies/lytenyte-core/internal";

function CheckboxBase(
  { indeterminate, renderMarker, onCheckChange: onCheck, ...props }: Checkbox.Props,
  ref: Checkbox.Props["ref"],
) {
  const [checked, setChecked] = useControlled({
    controlled: props.checked,
    default: props.initialChecked ?? false,
  });

  const onCheckChanged = useEvent((b: boolean) => {
    setChecked(b);
    onCheck?.(b);
  });

  const marker = useSlot({
    slot: renderMarker ?? (checked ? <CheckIcon /> : indeterminate ? <DashIcon /> : <></>),
    state: {
      indeterminate: indeterminate ?? false,
      checked,
    },
  });

  return (
    <div
      data-ln-checkbox
      data-ln-checked={checked}
      data-ln-indeterminate={indeterminate}
      data-ln-disabled={props.disabled}
      style={{ position: "relative" }}
    >
      {marker}
      <input
        data-ln-checkbox-input
        onChange={(e) => {
          props.onChange?.(e);
          if (e.defaultPrevented || e.isPropagationStopped()) return;

          onCheckChanged(e.target.checked);
        }}
        type="checkbox"
        ref={ref}
        {...props}
        style={{
          width: "100%",
          height: "100%",
          opacity: 0,
          margin: 0,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}

function CheckIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg width="11" height="11" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.00024 4.34783C2.53871 5.26087 3.76948 7.08696 4.07717 8C5.61563 4.34783 7.76948 1.91304 9.00024 1"
        stroke="currentcolor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentcolor"
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128Z"></path>
    </svg>
  );
}

export const Checkbox = forwardRef(CheckboxBase);

export namespace Checkbox {
  export type State = {
    readonly indeterminate: boolean;
    readonly checked: boolean;
  };

  export type Props = JSX.IntrinsicElements["input"] & {
    readonly indeterminate?: boolean;
    readonly initialChecked?: boolean;
    readonly renderMarker?: SlotComponent<State>;

    readonly onCheckChange?: (b: boolean) => void;
  };
}

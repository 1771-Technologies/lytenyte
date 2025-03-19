import { clsx } from "@1771technologies/js-utils";
import type { ChangeEvent, HTMLProps } from "react";

export interface RadioProps {
  readonly onCheckChange?: (c: boolean, event: ChangeEvent) => void;
}

export function Radio({
  onCheckChange,
  checked,
  disabled,
  ...other
}: Omit<HTMLProps<HTMLInputElement>, "onChange"> & RadioProps) {
  return (
    <div
      className={clsx(
        "lng1771-radio",
        !disabled && "lng1771-radio--hover",
        disabled && "lng1771-radio--disabled",
        checked && "lng1771-radio--checked",
        disabled && checked && "lng1771-radio--checked-disabled",
      )}
    >
      <input
        type="radio"
        className={css`
          all: unset;
          width: 100%;
          height: 100%;
          opacity: 0;
        `}
        checked={checked}
        onChange={(e) => onCheckChange?.(e.target.checked, e)}
        {...other}
      />
    </div>
  );
}

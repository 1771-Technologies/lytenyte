import "./components.css";

import { clsx } from "@1771technologies/js-utils";
import type { ChangeEvent, HTMLProps } from "react";

export interface CheckboxProps {
  isDeterminate?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  isChecked: boolean;
  onCheckChange?: (c: boolean, event: ChangeEvent) => void;
}

export function Checkbox({
  isDisabled,
  isChecked,
  isDeterminate,
  onCheckChange,
  isLoading,
  ...props
}: CheckboxProps & Omit<HTMLProps<HTMLInputElement>, "className">) {
  return (
    <div className={clsx("lng1771-checkbox", !isDisabled && "lng1771-checkbox--disabled")}>
      <input
        {...props}
        className="lng1771-checkbox__input"
        checked={isChecked}
        onPointerDownCapture={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onChange={(e) => {
          onCheckChange?.(e.target.checked, e);
        }}
        type="checkbox"
        disabled={isDisabled}
      />
      <div
        className={clsx(
          "lng1771-checkbox__mark",
          isDisabled && "lng1771-checkbox__mark--disabled",
          !isDisabled && isChecked && "lng1771-checkbox__mark--checked",
          isLoading && "lng1771-checkbox__mark--loading",
        )}
      >
        {isChecked && !isDeterminate && <CheckMark />}
        {isChecked && isDeterminate && <CheckIndeterminate />}
        {!isChecked && isDisabled && <CheckboxDisabled />}
      </div>
    </div>
  );
}

export function CheckMark() {
  return (
    <svg width="12" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.38721 4.34783C2.92567 5.26087 4.15644 7.08696 4.46413 8C6.00259 4.34783 8.15644 1.91304 9.38721 1"
        stroke="currentcolor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIndeterminate() {
  return (
    <svg width="12" height="2" viewBox="0 0 11 2" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.38721 1H9.38721"
        stroke="currentcolor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckboxDisabled() {
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.720459 6.99967C0.720459 10.6812 3.70564 13.6663 7.38713 13.6663C11.0686 13.6663 14.0538 10.6812 14.0538 6.99967C14.0538 3.31745 11.0686 0.333008 7.38713 0.333008C3.70564 0.333008 0.720459 3.31745 0.720459 6.99967ZM4.29527 2.84412C5.15972 2.20042 6.22713 1.81449 7.38713 1.81449C10.2508 1.81449 12.5723 4.13597 12.5723 6.99967C12.5723 8.16042 12.1871 9.22782 11.5427 10.0915L4.29527 2.84412ZM2.20194 6.99967C2.20194 5.83079 2.59379 4.75597 3.24564 3.8893L10.4975 11.1412C9.63009 11.7937 8.55527 12.1849 7.38713 12.1849C4.52342 12.1849 2.20194 9.86338 2.20194 6.99967Z"
        fill="currentcolor"
      />
    </svg>
  );
}

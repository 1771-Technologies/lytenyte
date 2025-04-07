import "./toggle.css";
import { clsx } from "@1771technologies/js-utils";
import { useRef } from "react";

export interface ToggleProps {
  readonly on: boolean;
  readonly onChange: (b: boolean) => void;
  readonly disabled?: boolean;
  readonly id?: string;
}
export function Toggle({ on, onChange, disabled, id }: ToggleProps) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className={clsx(
        "lng1771-toggle",
        on && !disabled && "lng1771-toggle--on",
        disabled && "lng1771-toggle--disabled",
      )}
      onClick={() => {
        if (disabled) return;
        onChange(!on);
        ref.current?.focus();
      }}
    >
      <div
        className={clsx(
          on && "lng1771-toggle__thumb--on",
          !on && "lng1771-toggle__thumb--off",
          disabled && "lng1771-toggle__thumb--disabled",
        )}
      ></div>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
    </div>
  );
}

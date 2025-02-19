import "./components.css";

import { clsx } from "@1771technologies/js-utils";
import type { JSX, ReactNode, RefObject } from "react";

export interface InputProps {
  readonly error?: boolean;
  readonly small?: boolean;
  readonly ghost?: boolean;
  readonly icon?: (p: JSX.IntrinsicElements["svg"]) => ReactNode;
  readonly inputRef?: RefObject<HTMLInputElement | null>;
}

export function Input({
  className,
  error,
  small,
  ghost,
  disabled,
  icon: Icon,
  inputRef,
  ...props
}: JSX.IntrinsicElements["input"] & InputProps) {
  return (
    <div
      className={clsx(
        "lng1771-input",
        error && "lng1771-input--error",
        small && "lng1771-input--small",
        disabled && "lng1771-input--disabled",
        ghost && "lng1771-input--ghost",
        className,
      )}
    >
      {Icon && <Icon width={small ? 16 : 20} height={small ? 16 : 20} />}
      <input
        ref={inputRef}
        {...props}
        disabled={disabled}
        className={clsx("lng1771-input__inner")}
      />
    </div>
  );
}

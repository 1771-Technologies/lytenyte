import "./components.css";

import { clsx } from "@1771technologies/js-utils";
import { refCompat } from "@1771technologies/react-utils";
import type { JSX, ReactNode } from "react";

export interface InputProps {
  readonly error?: boolean;
  readonly small?: boolean;
  readonly ghost?: boolean;
  readonly icon?: (p: JSX.IntrinsicElements["svg"]) => ReactNode;
}

function InputImpl({
  className,
  error,
  small,
  ghost,
  disabled,
  icon: Icon,
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
      <input {...props} disabled={disabled} className={clsx("lng1771-input__inner")} />
    </div>
  );
}

export const Input = refCompat(InputImpl, "Input");

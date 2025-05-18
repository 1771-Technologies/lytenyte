import "./button.css";
import { clsx } from "@1771technologies/js-utils";
import { refCompat } from "@1771technologies/react-utils";
import type { JSX } from "react";

const ButtonImpl = ({
  kind,
  disabled,

  ...props
}: JSX.IntrinsicElements["button"] & {
  kind: "primary" | "secondary" | "tertiary";
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        "lng1771-button",
        kind === "primary" && "lng1771-button--primary",
        kind === "tertiary" && "lng1771-button-tertiary",
        kind === "secondary" && "lng1771-button--secondary",
        props.className,
      )}
    />
  );
};

export const Button = refCompat(ButtonImpl, "Button");

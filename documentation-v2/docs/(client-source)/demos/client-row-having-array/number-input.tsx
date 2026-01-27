import type { ChangeEvent, JSX } from "react";

const handleNumberInput = (
  e: ChangeEvent<HTMLInputElement>,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
) => {
  const value = e.target.value;

  // Allow empty input
  if (value === "") {
    e.target.value = "";
    onChange?.(e);
    return;
  }

  // Allow minus sign only at the start
  if (value === "-") {
    e.target.value = "-";
    onChange?.(e);
    return;
  }

  // Convert to number and check if it's an integer
  const number = Number(value);
  if (value && !Number.isNaN(number)) {
    e.target.value = String(number) + (value.endsWith(".") ? "." : "");
  } else {
    // If not a valid integer, revert to previous value
    e.target.value = value.slice(0, -1);
  }

  onChange?.(e);
};

export function NumberInput({ ...props }: JSX.IntrinsicElements["input"]) {
  return (
    <input
      {...props}
      className="border-ln-border-field-and-button focus:outline-ln-primary-50 h-6 w-full rounded border focus:outline"
      onChange={(e) => {
        handleNumberInput(e, props.onChange);
      }}
    />
  );
}

import { forwardRef, type JSX } from "react";
import { useColumnManagerState } from "./column-manager-state";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";
import { SearchIcon } from "../icons";
import { clsx } from "@1771technologies/js-utils";

export const ColumnManagerSearch = forwardRef<
  HTMLInputElement,
  Omit<JSX.IntrinsicElements["input"], "value">
>(function ColumnManagerSearch({ className, ...props }, ref) {
  const { query, setQuery } = useColumnManagerState();

  return (
    <Input
      {...props}
      ref={ref}
      small
      className={clsx("lng1771-column-manager__search-input", className)}
      icon={SearchIcon}
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        props.onChange?.(e);
      }}
    />
  );
});

import { clsx } from "@1771technologies/js-utils";
import { useMemo } from "react";

export function usePopoverClass<T>(
  name: string,
  className: string | undefined | ((p: T) => string),
) {
  return useMemo(() => {
    if (typeof className !== "function") return clsx(name, className);

    return (p: T) => clsx(name, className(p));
  }, [className, name]);
}

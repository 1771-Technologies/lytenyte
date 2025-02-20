import { useMemo } from "react";
import { useEvent } from "./use-event";
import { debounce } from "@1771technologies/js-utils";

export function useDebounced<F extends (...args: Parameters<F>) => ReturnType<F>>(
  fn: F,
  wait: number,

  { leading, trailing }: { leading?: boolean; trailing?: boolean } = {},
) {
  const event = useEvent(fn);

  const debounced = useMemo(
    () => debounce(event, wait, { leading, trailing }),
    [event, leading, trailing, wait],
  );

  return debounced;
}

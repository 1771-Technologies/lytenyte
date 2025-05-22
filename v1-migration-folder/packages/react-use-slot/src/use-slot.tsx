import { cloneElement, type ReactElement } from "react";
import type { AnyProps, AnyRef } from "./+types.use-slot";
import { mergeProps } from "./merge-props";
import { getElementRef } from "./get-element-ref";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";

export interface UseSlotProps {
  readonly ref?: AnyRef;
  readonly props?: AnyProps | AnyProps[];
  readonly slot?: ReactElement | ((...args: any) => ReactElement);
  readonly state?: any;
}

/**
 * A React hook to support slots in components.
 */
export function useSlot({ props = {}, slot = <div />, state, ref: forwardedRef }: UseSlotProps) {
  const el = typeof slot === "function" ? slot(state) : slot;

  let merged = {};
  if (Array.isArray(props)) {
    for (let i = 0; i < props.length; i++) merged = mergeProps(merged, props[i]);
  } else {
    merged = props;
  }

  const mergedProps = mergeProps(merged, el.props as any);
  const ref = getElementRef(el);
  mergedProps.ref = useForkRef(forwardedRef, ref);

  return cloneElement(el, mergedProps);
}

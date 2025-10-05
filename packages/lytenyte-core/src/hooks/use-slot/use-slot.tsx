import { cloneElement, type ReactElement } from "react";
import type { AnyProps, AnyRef } from "./+types.use-slot.js";
import { mergeProps } from "./merge-props.js";
import { getElementRef } from "./get-element-ref.js";
import { useCombinedRefs } from "../use-combine-refs.js";

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

  const mergedRefs = useCombinedRefs(forwardedRef, ref);

  // One of the refs should be fined. We have to check for this since
  // not all elements accept a ref (e.g. Fragments)
  if (ref || forwardedRef) {
    mergedProps.ref = mergedRefs;
  }

  return cloneElement(el, mergedProps);
}

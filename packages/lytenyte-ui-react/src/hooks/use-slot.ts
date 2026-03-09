import type { ReactElement, Ref } from "react";
import { cloneElement } from "react";
import { mergeProps } from "./merge-props.js";
import { useCombinedRefs } from "./use-combined-ref.js";

interface UseSlotProps<T = any> {
  readonly slot: ReactElement | ((...args: any) => ReactElement);
  readonly props?: Record<string, any>[];
  readonly ref?: Ref<any>;
  readonly state?: T;
}

export function useSlot<T = any>({ props, slot, state, ref: forwardedRef }: UseSlotProps<T>) {
  const el = typeof slot === "function" ? slot(state) : slot;

  let merged = {};
  if (props) for (let i = 0; i < props?.length; i++) merged = mergeProps(merged, props[i]);

  const ref = (el.props as { ref?: React.Ref<unknown> }).ref || (el as any).ref;
  const mergedProps = mergeProps(merged, el.props as any);
  const mergedRefs = useCombinedRefs(forwardedRef, ref);

  if (ref || forwardedRef) mergedProps.ref = mergedRefs;

  return cloneElement(el, mergeProps);
}

export { isReactVersionAtLeast } from "./react-version.js";

export { fastMemo, fastDeepMemo } from "./fast-memo.js";

export type { UseSlotProps, SlotComponent } from "./use-slot/index.js";
export { useSlot } from "./use-slot/index.js";
export { getElementRef } from "./use-slot/get-element-ref.js";
export { mergeProps } from "./use-slot/merge-props.js";

export { useTransitionedOpen } from "./use-transitioned-open.js";
export type { TransitionOptions } from "./use-transitioned-open.js";

export { useMeasure } from "./use-measure/use-measure.js";
export type {
  UseMeasureOptions,
  RectReadOnly,
  UseMeasureResult,
  UseMeasureState,
} from "./use-measure/+types.js";

export { useForkRef } from "./use-fork-ref.js";
export { useEvent } from "./use-event.js";
export { useIsoEffect } from "./use-iso-effect.js";
export { usePrevious } from "./use-previous.js";
export { useOnWindowResize } from "./use-on-window-resize.js";
export { useCombinedRefs } from "./use-combine-refs.js";

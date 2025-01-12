import type { useTooltip } from "@1771technologies/react-tooltip";
import type { FocusEvent, HTMLProps, KeyboardEvent, PointerEvent } from "react";
import { useMemo } from "react";

export function useMergedTooltipEvents(
  {
    onFocus: focus,
    onBlur: blur,
    onKeyDown: keydown,
    onPointerEnter: enter,
    onPointerLeave: leave,
  }: HTMLProps<HTMLElement>,
  tooltip: ReturnType<typeof useTooltip>,
  show: boolean,
) {
  const {
    onBlur: tBlur,
    onFocus: tFocus,
    onKeyDown: tKeydown,
    onPointerEnter: tEnter,
    onPointerLeave: tLeave,
  } = tooltip;

  const mergedProps = useMemo(() => {
    if (!show) return {};

    const onBlur = (ev: FocusEvent<any>) => {
      blur?.(ev);
      tBlur();
    };
    const onFocus = (ev: FocusEvent<any>) => {
      focus?.(ev);
      tFocus(ev);
    };
    const onKeyDown = (ev: KeyboardEvent<any>) => {
      keydown?.(ev);
      tKeydown(ev);
    };
    const onPointerEnter = (ev: PointerEvent<any>) => {
      enter?.(ev);
      tEnter(ev);
    };
    const onPointerLeave = (ev: PointerEvent<any>) => {
      leave?.(ev);
      tLeave();
    };

    return { onBlur, onFocus, onKeyDown, onPointerEnter, onPointerLeave };
  }, [blur, enter, focus, keydown, leave, show, tBlur, tEnter, tFocus, tKeydown, tLeave]);

  return mergedProps;
}

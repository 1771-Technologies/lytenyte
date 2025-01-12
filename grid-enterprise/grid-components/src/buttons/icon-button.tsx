import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import { useTooltip } from "@1771technologies/react-tooltip";
import { refCompat } from "@1771technologies/react-utils";
import {
  useId,
  useMemo,
  type FocusEvent,
  type JSX,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

function IconButtonImpl({
  kind,
  disabledReason,
  onFocus: focus,
  onBlur: blur,
  onKeyDown: keydown,
  onPointerEnter: enter,
  onPointerLeave: leave,
  disabled,

  ...props
}: JSX.IntrinsicElements["button"] & { kind: "ghost" | "normal"; disabledReason?: string }) {
  const id = useId();
  const {
    onBlur: tBlur,
    onFocus: tFocus,
    onKeyDown: tKeydown,
    onPointerEnter: tEnter,
    onPointerLeave: tLeave,
  } = useTooltip(id, <div>{disabledReason}</div>);

  const mergedProps = useMemo(() => {
    if (!disabled || !disabledReason) return {};

    const onBlur = (ev: FocusEvent<HTMLButtonElement>) => {
      blur?.(ev);
      tBlur();
    };
    const onFocus = (ev: FocusEvent<HTMLButtonElement>) => {
      focus?.(ev);
      tFocus(ev);
    };
    const onKeyDown = (ev: KeyboardEvent<HTMLButtonElement>) => {
      keydown?.(ev);
      tKeydown(ev);
    };
    const onPointerEnter = (ev: PointerEvent<HTMLButtonElement>) => {
      enter?.(ev);
      tEnter(ev);
    };
    const onPointerLeave = (ev: PointerEvent<HTMLButtonElement>) => {
      leave?.(ev);
      tLeave();
    };

    return { onBlur, onFocus, onKeyDown, onPointerEnter, onPointerLeave };
  }, [
    blur,
    disabled,
    disabledReason,
    enter,
    focus,
    keydown,
    leave,
    tBlur,
    tEnter,
    tFocus,
    tKeydown,
    tLeave,
  ]);

  return (
    <button
      {...props}
      {...mergedProps}
      disabled={disabled}
      className={clsx(
        css`
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        `,

        kind === "ghost" &&
          css`
            &:focus {
              background-color: ${t.colors.backgrounds_light};
              border: 1px solid ${t.colors.borders_focus};
              outline: none;
            }
            background-color: transparent;
            border: 1px solid transparent;
            border-radius: ${t.spacing.box_radius_regular};
            color: ${t.colors.borders_icons_default};
          `,
        props.className,
      )}
    />
  );
}

export const IconButton = refCompat(IconButtonImpl, "Button");

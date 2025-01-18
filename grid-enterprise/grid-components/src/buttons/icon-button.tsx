import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import { useTooltip } from "@1771technologies/react-tooltip";
import { refCompat } from "@1771technologies/react-utils";
import { useId, type JSX, type ReactNode } from "react";
import { useMergedTooltipEvents } from "./use-merged-tooltip-events";

function IconButtonImpl({
  kind,
  disabledReason,
  disabled,
  tooltip,
  small,

  ...props
}: JSX.IntrinsicElements["button"] & {
  kind: "ghost" | "normal";
  small?: boolean;
  disabledReason?: ReactNode;
  tooltip?: ReactNode;
}) {
  const id = useId();
  const disableTooltip = useTooltip(id, <div>{disabledReason}</div>, { placement: "top" });
  const infoTooltip = useTooltip(id, <div>{tooltip}</div>, { placement: "top" });

  const mergedDisabled = useMergedTooltipEvents(
    props,
    disableTooltip,
    Boolean(disabled && disabledReason),
  );
  const mergedInfo = useMergedTooltipEvents(props, infoTooltip, Boolean(!disabled && tooltip));

  return (
    <button
      {...props}
      {...mergedDisabled}
      {...mergedInfo}
      disabled={disabled}
      className={clsx(
        css`
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          color: ${t.colors.borders_icons_default};
          cursor: pointer;
        `,
        small &&
          css`
            width: 20px;
            height: 20px;
          `,

        disabled &&
          css`
            border: 1px solid transparent;
            border-radius: ${t.spacing.box_radius_regular};
            background-color: ${t.colors.backgrounds_strong};
            color: ${t.colors.text_x_light};
            cursor: not-allowed;
          `,

        !disabled &&
          kind === "ghost" &&
          css`
            &:focus-visible {
              background-color: ${t.colors.backgrounds_light};
              border: 1px solid ${t.colors.borders_focus};
              outline: none;
            }
            &:hover {
              background-color: ${t.colors.backgrounds_button_light};
            }
            background-color: transparent;
            border: 1px solid transparent;
            border-radius: ${t.spacing.box_radius_regular};
          `,
        props.className,
      )}
    />
  );
}

export const IconButton = refCompat(IconButtonImpl, "Button");

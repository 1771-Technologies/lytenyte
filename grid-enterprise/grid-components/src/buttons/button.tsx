import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import { useTooltip } from "@1771technologies/react-tooltip";
import { refCompat } from "@1771technologies/react-utils";
import { useId, type JSX, type ReactNode } from "react";
import { useMergedTooltipEvents } from "./use-merged-tooltip-events";

const ButtonImpl = ({
  kind,
  disabledReason,
  disabled,
  tooltip,

  ...props
}: JSX.IntrinsicElements["button"] & {
  kind: "primary" | "secondary" | "plain";
  disabledReason?: ReactNode;
  tooltip?: ReactNode;
}) => {
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
      disabled={disabled}
      {...mergedDisabled}
      {...mergedInfo}
      className={clsx(
        kind !== "plain" && "lng1771-text-small",
        kind !== "plain" &&
          css`
            display: flex;
            align-items: center;
            justify-content: center;
            padding-inline: ${t.spacing.space_05};
            height: ${t.spacing.input_height};
            min-width: 56px;
            border: 1px solid transparent;
            border-radius: ${t.spacing.field_radius_small};
            cursor: pointer;
          `,
        kind === "primary" &&
          css`
            color: ${t.colors.text_primary_button};
            background-color: ${t.colors.primary_50};

            box-shadow:
              0px 1px 1px 0px rgba(0, 0, 0, 0.08),
              0px 1px 3px 0px rgba(25, 59, 77, 0.3),
              0px 0px 0px 1px rgba(0, 0, 0, 0.05),
              0px 0px 0px 1px ${t.colors.borders_button_light};

            &:hover {
              background-color: color-mix(in srgb, ${t.colors.primary_50} 90%, white 10%);
            }
          `,
        kind === "secondary" &&
          css`
            background-color: ${t.colors.backgrounds_button_light};
            box-shadow:
              0px 1.5px 2px 0px rgba(18, 46, 88, 0.08),
              0px 0px 0px 1px ${t.colors.borders_button_light};

            &:hover {
              background-color: color-mix(
                in srgb,
                ${t.colors.backgrounds_button_light} 90%,
                white 4%
              );
            }
          `,
        props.className,
      )}
    />
  );
};

export const Button = refCompat(ButtonImpl, "Button");

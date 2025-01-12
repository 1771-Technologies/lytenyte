import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import { refCompat } from "@1771technologies/react-utils";
import type { JSX } from "react";

const ButtonImpl = ({
  kind,
  ...props
}: JSX.IntrinsicElements["button"] & { kind: "primary" | "secondary" }) => {
  return (
    <button
      {...props}
      className={clsx(
        "lng1771-text-small",
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

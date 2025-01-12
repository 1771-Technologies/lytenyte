import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import { useTooltip } from "@1771technologies/react-tooltip";
import { refCompat } from "@1771technologies/react-utils";
import { useId, type JSX } from "react";

function IconButtonImpl({
  kind,
  disabledReason,
  ...props
}: JSX.IntrinsicElements["button"] & { kind: "ghost" | "normal"; disabledReason?: string }) {
  const id = useId();
  const tooltip = useTooltip(id, <div>{disabledReason}</div>);

  return (
    <button
      {...props}
      {...(props.disabled ? tooltip : {})}
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

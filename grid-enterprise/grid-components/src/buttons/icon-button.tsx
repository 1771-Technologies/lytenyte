import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import { refCompat } from "@1771technologies/react-utils";
import type { JSX } from "react";

function IconButtonImpl({
  kind,
  ...props
}: JSX.IntrinsicElements["button"] & { kind: "ghost" | "normal" }) {
  return (
    <button
      {...props}
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

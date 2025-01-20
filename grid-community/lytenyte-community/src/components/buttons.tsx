import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import { refCompat } from "@1771technologies/react-utils";
import type { JSX } from "react";

const ButtonImpl = (props: JSX.IntrinsicElements["button"]) => {
  return (
    <button
      tabIndex={-1}
      {...props}
      className={clsx(
        css`
          border: none;
          padding: 0px;
          font-weight: 600;
          height: 24px;
          width: 24px;
          border-radius: ${t.spacing.box_radius_regular};
          cursor: pointer;

          background-color: ${t.colors.backgrounds_light};
          &:focus-visible {
            outline: none;
          }
          &:hover {
            background-color: ${t.colors.backgrounds_button_light};
          }
        `,
        props.className,
      )}
    >
      {props.children}
    </button>
  );
};

export const GridButton = refCompat(ButtonImpl, "Button");

export function CollapseButton(props: JSX.IntrinsicElements["button"]) {
  return <GridButton {...props}>-</GridButton>;
}
export function ExpandButton(props: JSX.IntrinsicElements["button"]) {
  return <GridButton {...props}>+</GridButton>;
}

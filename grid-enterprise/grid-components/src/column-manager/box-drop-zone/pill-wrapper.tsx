import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import type { JSX } from "react";

export function PillWrapper({
  children,
  isFirst,
  ...props
}: JSX.IntrinsicElements["div"] & { isFirst: boolean }) {
  return (
    <div
      {...props}
      tabIndex={-1}
      className={clsx(
        isFirst &&
          css`
            padding-block-start: 4px;
          `,
        css`
          height: 36px;
          display: flex;
          align-items: center;
          padding-inline: ${t.spacing.space_20};
          &:focus {
            outline: none;
          }
          &:focus > div {
            outline: 1px solid ${t.colors.borders_focus};
            outline-offset: -2px;
          }
        `,
        props.className,
      )}
    >
      {children}
    </div>
  );
}

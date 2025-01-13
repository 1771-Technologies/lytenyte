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
        `,
        props.className,
      )}
    >
      {children}
    </div>
  );
}

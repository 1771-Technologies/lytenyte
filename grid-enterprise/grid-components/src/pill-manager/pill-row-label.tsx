import type { JSX, ReactNode } from "react";
import { Icon } from "../icon";
import { clsx } from "@1771technologies/js-utils";

export function PillRowLabel(props: {
  icon: (props: JSX.IntrinsicElements["svg"]) => ReactNode;
  label: string;
  hasOverflow: boolean;
}) {
  return (
    <div
      className={clsx(
        css`
          display: flex;
          align-items: center;
          padding-inline-start: var(--lng1771-space-50);
          gap: var(--lng1771-space-05);
          font-size: var(--lng1771-body-m);
          font-family: var(--lng1771-typeface-body);
          font-weight: 500;
          color: var(--lng1771-text-medium);
          position: relative;

          & svg {
            color: var(--lng1771-borders-icons-default);
          }
        `,
        props.hasOverflow &&
          css`
            &::after {
              content: "";
              display: block;
              position: absolute;
              top: 0px;
              inset-inline-end: -3px;
              background-image: var(--lng1771-gradient-shadow);
              opacity: 0.15;
              width: 4px;
              height: 100%;
              z-index: 2;
            }
          `,
      )}
    >
      <Icon>
        <props.icon width={20} height={20} />
      </Icon>
      <div
        className={css`
          @container (max-width: 450px) {
            display: none;
          }
        `}
      >
        {props.label}
      </div>
    </div>
  );
}

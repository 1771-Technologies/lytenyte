import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import type { CSSProperties } from "react";

export interface SeparatorProps {
  readonly dir: "vertical" | "horizontal";
  readonly soft?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function Separator(props: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={props.dir}
      className={clsx(
        props.dir === "horizontal" &&
          css`
            width: 100%;
            height: 1px;
            background-color: ${t.colors.borders_separator};
          `,
        props.dir === "vertical" &&
          css`
            width: 1px;
            height: 100%;
            background-color: ${t.colors.borders_separator};
          `,

        props.soft &&
          css`
            background-color: ${t.colors.borders_default};
          `,
        props.className,
      )}
      style={props.style}
    ></div>
  );
}

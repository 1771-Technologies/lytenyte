import { clsx } from "@1771technologies/js-utils";
import type { HTMLProps } from "react";

export const Icon = (p: HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...p}
      className={clsx(
        css`
          position: relative;
          width: 20px;
          height: 20px;
          min-width: 20px;
          min-height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0px;
          margin: 0px;
          border: none;
          background-color: transparent;
        `,
        p.className,
      )}
    >
      {p.children}
    </div>
  );
};

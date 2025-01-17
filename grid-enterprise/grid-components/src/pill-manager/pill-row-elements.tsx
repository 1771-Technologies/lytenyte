import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { clsx } from "@1771technologies/js-utils";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import type { PillProps } from "../pills/pill";

export interface PillRowItem {
  readonly id: string;
  readonly column: ColumnEnterpriseReact<any>;
  readonly kind: PillProps["kind"];
  readonly inactive: boolean;
}

export function PillRowElements({
  onOverflow,
  onScroll,
  expanded,
  children,
}: PropsWithChildren<{
  onOverflow: (b: boolean) => void;
  onScroll: (b: boolean) => void;
  expanded: boolean;
}>) {
  const [row, setRow] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!row) return;

    const observer = new ResizeObserver(() => {
      onOverflow(row.scrollWidth > row.clientWidth);
    });
    observer.observe(row);

    return () => observer.disconnect();
  }, [onOverflow, row]);

  return (
    <div
      ref={setRow}
      onScroll={() => {
        onScroll(Math.abs(row?.scrollLeft ?? 0) > 0);
      }}
      className={clsx(
        css`
          min-height: 42px;
          display: flex;
          width: 100%;
          overflow: auto;
          scrollbar-width: none;
          align-items: center;
          padding-inline-end: var(--lng1771-space-04);
          padding-inline-start: var(--lng1771-space-04);
          box-sizing: content-box;

          &::-webkit-scrollbar {
            display: none;
          }
        `,
        expanded &&
          css`
            flex-wrap: wrap;
          `,
      )}
    >
      {children}
    </div>
  );
}

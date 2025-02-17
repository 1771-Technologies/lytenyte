import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { clsx } from "@1771technologies/js-utils";
import type { PropsWithChildren, ReactNode, RefObject } from "react";
import { useEffect, useState } from "react";
import type { PillProps } from "../pills/pill";
import { useCombinedRefs } from "@1771technologies/react-utils";

export interface PillRowItem {
  readonly id: string;
  readonly column: ColumnEnterpriseReact<any>;
  readonly kind: PillProps["kind"];
  readonly inactive: boolean;
  readonly dragTags: string[];
  readonly dropTags: string[];
  readonly labelRenderer?: (p: { item: PillRowItem; api: ApiEnterpriseReact<any> }) => ReactNode;
  readonly endContent?: ReactNode;
}

export function PillRowElements({
  onOverflow,
  onScroll,
  expanded,
  rowRef,
  children,
}: PropsWithChildren<{
  onOverflow: (b: boolean) => void;
  onScroll: (b: boolean) => void;
  expanded: boolean;
  rowRef: RefObject<HTMLDivElement | null>;
}>) {
  const [row, setRow] = useState<HTMLDivElement | null>(null);

  const ref = useCombinedRefs(rowRef, setRow);

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
      ref={ref}
      onScroll={() => {
        onScroll(Math.abs(row?.scrollLeft ?? 0) > 0);
      }}
      className={clsx(
        css`
          min-height: 42px;
          display: flex;
          width: 100%;
          overflow: var(--lng1771-overflow-val);
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

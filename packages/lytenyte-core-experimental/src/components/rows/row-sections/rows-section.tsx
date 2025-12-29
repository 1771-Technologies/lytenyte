import { forwardRef, type JSX } from "react";

interface RowSectionProps {
  readonly rowFirst: number;
  readonly rowLast: number;
}

export const RowsSection = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RowSectionProps>(
  function RowsSection({ rowFirst, rowLast, ...props }, forwarded) {
    return (
      <div
        {...props}
        ref={forwarded}
        role="rowgroup"
        data-ln-row-first={rowFirst}
        data-ln-row-last={rowLast}
      />
    );
  },
);

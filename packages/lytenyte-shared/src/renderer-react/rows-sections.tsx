import { forwardRef, type JSX } from "react";

interface RowSectionProps {
  readonly rowFirst: number;
  readonly rowLast: number;
}

export const RowsTopReact = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & RowSectionProps & { readonly top: number; readonly height: number }
>(function RowsTop({ top, height, ...props }, forwarded) {
  if (height <= 0) return null;
  return (
    <RowsSection
      {...props}
      ref={forwarded}
      role="rowgroup"
      data-ln-rows-top
      style={{
        ...props.style,

        height,
        position: "sticky",
        top,
        zIndex: 4,
        minWidth: "100%",
      }}
    />
  );
});

export const RowsCenterReact = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] &
    RowSectionProps & { readonly height: number; pinSectionHeights: number }
>(function RowsCenter({ height, pinSectionHeights, ...props }, forwarded) {
  if (height <= 0) {
    return (
      <div role="presentation" style={{ height: `calc(100% - ${pinSectionHeights}px - 4px)` }} />
    );
  }

  return (
    <RowsSection
      {...props}
      ref={forwarded}
      role="rowgroup"
      data-ln-rows-center
      style={{
        ...props.style,
        height,
        minHeight: `calc(100% - ${pinSectionHeights}px - 4px)`,
        minWidth: "100%",
        position: "relative",
      }}
    />
  );
});

export const RowsBottomReact = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & RowSectionProps & { readonly height: number }
>(function RowsCenter({ height, ...props }, forwarded) {
  if (height <= 0) return null;

  return (
    <RowsSection
      {...props}
      ref={forwarded}
      role="rowgroup"
      data-ln-rows-bottom
      style={{
        ...props.style,

        height,
        boxSizing: "border-box",
        position: "sticky",
        bottom: 0,
        zIndex: 3,
        minWidth: "100%",
      }}
    />
  );
});

const RowsSection = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RowSectionProps>(
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

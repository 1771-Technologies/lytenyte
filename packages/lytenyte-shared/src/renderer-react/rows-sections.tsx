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
        zIndex: 3,
        minWidth: "100%",
      }}
    />
  );
});

export const RowsCenterReact = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & RowSectionProps & { readonly height: number }
>(function RowsCenter({ height, ...props }, forwarded) {
  if (height <= 0) return <div style={{ flex: "1" }} role="presentation" />;

  return (
    <RowsSection
      {...props}
      ref={forwarded}
      role="rowgroup"
      data-ln-rows-center
      style={{
        ...props.style,
        height,
        minHeight: height,
        flex: 1,
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

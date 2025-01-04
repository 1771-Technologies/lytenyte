import type { JSX } from "react";

/**
 * A presentational SVG component that renders a pattern of dots typically used
 * as a visual indicator for resize handles. Uses currentcolor for fill, allowing
 * the dots to inherit their color from the parent element.
 *
 * @component
 * @param props - Standard SVG element props, extends React's SVG intrinsic elements
 *
 * @remarks
 * - Renders as a 10x10 SVG with 6 dots in a diagonal pattern
 * - Automatically hidden from screen readers via aria-hidden
 * - Uses currentcolor to inherit color from parent
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ResizeDots />
 *
 * // With custom color
 * <div style={{ color: "blue" }}>
 *   <ResizeDots />
 * </div>
 * ```
 */
export const ResizeDots = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      role="presentation"
      aria-hidden="true"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="5" cy="9" r="1" fill="currentcolor" />
      <circle cx="9" cy="9" r="1" fill="currentcolor" />
      <circle cx="5" cy="5" r="1" fill="currentcolor" />
      <circle cx="9" cy="5" r="1" fill="currentcolor" />
      <circle cx="9" cy="1" r="1" fill="currentcolor" />
      <circle cx="1" cy="9" r="1" fill="currentcolor" />
    </svg>
  );
};

import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgCopyIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 21"
    ref={ref}
    {...props}
  >
    <path
      stroke="currentcolor"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="M14.977 15.584a3 3 0 0 1-2.603 2.603c-.186.023-.408.023-.852.023H6.83c-1.708 0-2.563 0-3.213-.338a3 3 0 0 1-1.28-1.279C2 15.943 2 15.09 2 13.38V8.968c0-.704 0-1.056.059-1.349a3 3 0 0 1 2.35-2.35c.145-.03.304-.044.514-.051"
    />
    <rect
      width={13}
      height={13}
      x={5}
      y={2.21}
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      rx={3}
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCopyIcon);
export default ForwardRef;

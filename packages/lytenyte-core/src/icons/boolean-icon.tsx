import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgBooleanIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <rect
      width={11.314}
      height={11.314}
      x={2}
      y={10.21}
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={2}
      transform="rotate(-45 2 10.21)"
    />
    <path fill="currentcolor" d="m16.5 8.71.5 1.5v1l-5.5 5.5-1.5.5v-14h1z" />
  </svg>
);
const ForwardRef = forwardRef(SvgBooleanIcon);
export default ForwardRef;

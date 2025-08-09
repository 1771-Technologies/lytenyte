import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgTagIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.94 13.657c-1.287-1.288-1.931-1.932-2.17-2.767-.24-.836-.036-1.724.374-3.498l.236-1.023c.344-1.494.517-2.24 1.028-2.752.511-.51 1.258-.683 2.751-1.027l1.024-.237c1.775-.41 2.661-.614 3.497-.375.836.24 1.48.884 2.767 2.172l1.525 1.525c2.242 2.241 3.362 3.361 3.362 4.753s-1.12 2.512-3.361 4.753-3.362 3.362-4.754 3.362-2.513-1.12-4.754-3.361z"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.351 8.787A1.667 1.667 0 1 0 5.994 6.43a1.667 1.667 0 0 0 2.357 2.357M9.619 15.626l5.816-5.816"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgTagIcon);
export default ForwardRef;

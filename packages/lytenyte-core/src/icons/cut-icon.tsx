import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgCutIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5 7.71a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5M5 17.71a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5M16.667 3.543l-9.9 9.9M12.058 12.276l4.608 4.6M6.767 6.977 10 10.21"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCutIcon);
export default ForwardRef;

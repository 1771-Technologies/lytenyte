import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgArchiveIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M17.5 6.877v7.583a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V9.826M16.916 2.71H3.083a1 1 0 0 0-1 1v2.167a1 1 0 0 0 1 1h13.833a1 1 0 0 0 1-1V3.71a1 1 0 0 0-1-1M8.334 10.21h3.333"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgArchiveIcon);
export default ForwardRef;

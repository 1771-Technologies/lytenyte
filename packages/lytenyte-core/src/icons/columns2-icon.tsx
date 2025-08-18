import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgColumns2Icon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 21 20"
    ref={ref}
    {...props}
  >
    <rect
      width={15}
      height={15}
      stroke="currentcolor"
      strokeLinecap="round"
      strokeWidth={1.5}
      rx={3}
      transform="matrix(1 0 0 -1 2.71 17.5)"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M7.21 17.5v-15M2.71 13h15"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgColumns2Icon);
export default ForwardRef;

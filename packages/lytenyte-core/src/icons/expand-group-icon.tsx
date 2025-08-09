import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgExpandGroupIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="m6.843 17.252-3.894-.004-.004-3.895M8.023 12.174l-5.074 5.074M13.157 3.144l3.895.004.003 3.894M17.052 3.146 11.978 8.22"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgExpandGroupIcon);
export default ForwardRef;

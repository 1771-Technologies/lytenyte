import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgRefreshIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="m19.05 11.509-2.056-2.057-2.057 2.057M.86 9.61l2.057 2.057L4.974 9.61"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.07 9.724q.016.24.016.486A7.084 7.084 0 0 1 4.88 15.106m-1.894-3.904a7.084 7.084 0 0 1 12.478-5.502"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgRefreshIcon);
export default ForwardRef;

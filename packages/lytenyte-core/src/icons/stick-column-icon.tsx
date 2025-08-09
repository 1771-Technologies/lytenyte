import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgStickColumnIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.539 3.21H4.462C3.102 3.21 2 4.174 2 5.364v9.692c0 1.19 1.102 2.154 2.462 2.154h11.077c1.359 0 2.461-.964 2.461-2.154V5.364c0-1.19-1.102-2.154-2.461-2.154"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m6.5 7.21 3 3-3 3M13 17.21v-14"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgStickColumnIcon);
export default ForwardRef;

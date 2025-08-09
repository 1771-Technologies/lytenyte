import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgDrag2Icon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="#676D80"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.578}
      d="M12.035 17.13c-.406.79-1.559.717-1.86-.119l-2.488-6.896a1.016 1.016 0 0 1 1.25-1.318l7.404 2.244c.907.275.978 1.53.108 1.906l-2.577 1.11c-.216.094-.394.26-.502.47z"
    />
    <path
      stroke="#676D80"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.578}
      d="M15 6.736V5.314a2.104 2.104 0 0 0-2.104-2.104H5.104A2.104 2.104 0 0 0 3 5.314v7.792c0 1.162.942 2.104 2.104 2.104h.727"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDrag2Icon);
export default ForwardRef;

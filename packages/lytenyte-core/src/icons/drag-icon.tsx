import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgDragIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      stroke="#676D80"
      strokeDasharray="0.11 2.63"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth={1.578}
      d="M12.526 3.71v0c0-1.04-.843-1.883-1.883-1.883H4.11a2.104 2.104 0 0 0-2.104 2.104v6.422c0 1.1.892 1.993 1.993 1.993v0"
    />
    <path
      stroke="#676D80"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.578}
      d="M13.183 17.081c-.39.831-1.596.758-1.884-.113l-1.868-5.652a1.016 1.016 0 0 1 1.283-1.284l5.652 1.869c.872.288.944 1.494.113 1.884l-1.91.899c-.214.1-.386.273-.487.487z"
    />
    <path
      stroke="#676D80"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.578}
      d="M15.519 8.3v-.986a2.104 2.104 0 0 0-2.104-2.104H7.104A2.104 2.104 0 0 0 5 7.314v6.31c0 1.163.942 2.105 2.104 2.105h.377"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDragIcon);
export default ForwardRef;

import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgExpression2Icon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth={1.923}
      d="M11.917 4.21v7.98M8.462 6.203l6.91 3.99M8.462 10.192l6.91-3.99"
    />
    <circle cx={5.806} cy={15.017} r={1.806} fill="currentcolor" />
  </svg>
);
const ForwardRef = forwardRef(SvgExpression2Icon);
export default ForwardRef;

import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgModalIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M13.462 2.46H4.288c-1.125 0-2.038.844-2.038 1.885v8.48c0 1.041.913 1.885 2.038 1.885h9.174c1.125 0 2.038-.844 2.038-1.885v-8.48c0-1.041-.913-1.885-2.039-1.885"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.462 5.46c1.125 0 2.038.844 2.038 1.885v8.48c0 1.041-.913 1.885-2.038 1.885H7.288c-1.125 0-2.038-.844-2.038-1.885"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.5 5.71h13"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgModalIcon);
export default ForwardRef;

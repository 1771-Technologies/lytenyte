import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgBookmarkIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={21} height={20} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m15.31 17.199-3.937-2.668c-.319-.226-.816-.226-1.135-.028l-4.54 2.81c-.71.453-1.738.028-1.738-.682V3.891c0-.767.78-1.391 1.738-1.391h9.648c.958 0 1.738.624 1.738 1.39v12.628c0 .738-1.064 1.135-1.774.68"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.601 7.875 10.15 9.5l3.095-3.25"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgBookmarkIcon);
export default ForwardRef;

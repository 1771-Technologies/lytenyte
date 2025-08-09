import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgFolderIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M18.333 16.043a1.667 1.667 0 0 1-1.666 1.667H3.332a1.667 1.667 0 0 1-1.666-1.667V4.377A1.667 1.667 0 0 1 3.333 2.71H7.5l1.666 2.5h7.5a1.667 1.667 0 0 1 1.667 1.667z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgFolderIcon);
export default ForwardRef;

import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgPasteIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 3.21h1.5c.398 0 .78.176 1.06.488.282.313.44.737.44 1.179v11.666c0 .442-.158.866-.44 1.179a1.43 1.43 0 0 1-1.06.488h-9c-.398 0-.78-.176-1.06-.488A1.77 1.77 0 0 1 4 16.543V4.877c0-.442.158-.866.44-1.179A1.43 1.43 0 0 1 5.5 3.21H7"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.25 2.21h-4.5a.75.75 0 0 0-.75.75v1.5c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgPasteIcon);
export default ForwardRef;

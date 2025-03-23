import type { JSX } from "react";

export const ArrowRightIcon = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

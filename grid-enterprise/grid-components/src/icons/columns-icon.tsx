import type { JSX } from "react";

export const ColumnsIcon = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="2.5"
        y="2.5"
        width="15"
        height="15"
        rx="3"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M7 2.5V17.5" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2.5 7L17.5 7" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

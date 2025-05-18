import type { JSX } from "react";

export const MeasuresIcon = (props: JSX.IntrinsicElements["svg"]) => {
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
        d="M15 6.25V4H5L10.7143 10L5 16H15V13.75"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

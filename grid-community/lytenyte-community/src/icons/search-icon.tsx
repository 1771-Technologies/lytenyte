import type { JSX } from "react";

export function SearchIcon(props: JSX.IntrinsicElements["svg"]) {
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
        d="M13.8976 13.8707C16.5579 11.2103 16.5579 6.89709 13.8976 4.23677C11.2373 1.57645 6.92404 1.57645 4.26372 4.23677C1.6034 6.89709 1.6034 11.2103 4.26372 13.8707C6.92404 16.531 11.2373 16.531 13.8976 13.8707Z"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.2793 14.252L18.0293 18.002"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

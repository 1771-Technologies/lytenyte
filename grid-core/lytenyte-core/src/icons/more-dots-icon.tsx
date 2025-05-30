import type { JSX } from "react";

export const MoreDotsIcon = (props: JSX.IntrinsicElements["svg"]) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5 3.75C11.5 2.7835 10.7165 2 9.75 2C8.7835 2 8 2.7835 8 3.75C8 4.7165 8.7835 5.5 9.75 5.5C10.7165 5.5 11.5 4.7165 11.5 3.75ZM9.75 8C10.7165 8 11.5 8.7835 11.5 9.75C11.5 10.7165 10.7165 11.5 9.75 11.5C8.7835 11.5 8 10.7165 8 9.75C8 8.7835 8.7835 8 9.75 8ZM9.75 14C10.7165 14 11.5 14.7835 11.5 15.75C11.5 16.7165 10.7165 17.5 9.75 17.5C8.7835 17.5 8 16.7165 8 15.75C8 14.7835 8.7835 14 9.75 14Z"
        fill="currentcolor"
      />
    </svg>
  );
};

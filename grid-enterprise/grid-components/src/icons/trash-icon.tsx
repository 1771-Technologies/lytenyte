import type { JSX } from "react";

export const TrashIcon = (props: JSX.IntrinsicElements["svg"]) => {
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
        d="M3 5H4.55556H17"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 5.2V16.4C15 16.8243 14.8495 17.2313 14.5816 17.5314C14.3137 17.8314 13.9503 18 13.5714 18H6.42857C6.04969 18 5.68633 17.8314 5.41842 17.5314C5.15051 17.2313 5 16.8243 5 16.4V5.2M7.14286 4.2V3.6C7.14286 3.17565 7.29337 2.76869 7.56128 2.46863C7.82919 2.16857 8.19255 2 8.57143 2H11.4286C11.8075 2 12.1708 2.16857 12.4387 2.46863C12.7066 2.76869 12.8571 3.17565 12.8571 3.6V4.2"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

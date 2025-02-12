import { clsx } from "@1771technologies/js-utils";
import type { JSX } from "react";

export const SortArrowAsc = (p: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path
        d="M5.21619 7.78332L10 2.99951M10 2.99951L14.7838 7.78332M10 2.99951L10 16.481"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const SortArrowDesc = (p: JSX.IntrinsicElements["svg"]) => {
  return (
    <SortArrowAsc
      className={clsx(
        css`
          transform: rotate(180deg);
        `,
        p.className,
      )}
      {...p}
    />
  );
};
export const FilterDashesIcon = (p: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...p}
    >
      <path
        d="M2.25 4H17.25M4.65 10H14.85M8.25 16H11.25"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MoreDotsVertical = (p: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentcolor"
      {...p}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5 3.75C11.5 2.7835 10.7165 2 9.75 2C8.7835 2 8 2.7835 8 3.75C8 4.7165 8.7835 5.5 9.75 5.5C10.7165 5.5 11.5 4.7165 11.5 3.75ZM9.75 8C10.7165 8 11.5 8.7835 11.5 9.75C11.5 10.7165 10.7165 11.5 9.75 11.5C8.7835 11.5 8 10.7165 8 9.75C8 8.7835 8.7835 8 9.75 8ZM9.75 14C10.7165 14 11.5 14.7835 11.5 15.75C11.5 16.7165 10.7165 17.5 9.75 17.5C8.7835 17.5 8 16.7165 8 15.75C8 14.7835 8.7835 14 9.75 14Z"
      />
    </svg>
  );
};

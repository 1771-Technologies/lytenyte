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
      className={css`
        transform: rotate(180deg);
      `}
      {...p}
    />
  );
};

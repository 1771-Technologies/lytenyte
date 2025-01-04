import { refCompat } from "@1771technologies/react-utils";
import type { JSX } from "react";

function ArrowSvgImpl(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" {...props} width={16} height={8}>
      <path d="M8 0L16 8H0L8 0Z" />
    </svg>
  );
}

export const ArrowSvg = refCompat(ArrowSvgImpl, "ArrowSvg");

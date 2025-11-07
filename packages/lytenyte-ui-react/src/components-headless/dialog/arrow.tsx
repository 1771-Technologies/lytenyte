import { forwardRef, type JSX } from "react";
import { useDialogRoot } from "./context.js";
import { useCombinedRefs } from "../../hooks/use-combined-ref.js";

const ArrowBase = (
  props: JSX.IntrinsicElements["svg"],
  ref: JSX.IntrinsicElements["svg"]["ref"],
) => {
  const ctx = useDialogRoot();

  const combined = useCombinedRefs(ref, ctx.setArrow as any);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 8"
      aria-hidden
      height={8}
      focusable="false"
      {...props}
      ref={combined}
    >
      <polygon points="0,8 8,0 16,8" data-arrow-area />
      <path
        data-arrow-border
        d="M0 8 L8 0 L16 8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Arrow = forwardRef(ArrowBase);

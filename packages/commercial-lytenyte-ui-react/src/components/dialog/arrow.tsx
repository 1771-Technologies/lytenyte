import { forwardRef, type JSX } from "react";
import { useDialogRoot } from "./context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-hooks-react";
import { useSlot } from "@1771technologies/lytenyte-hooks-react";
import type { LnComponent } from "../../types.js";

const DialogArrowBase = (
  { render, ...props }: DialogArrow.Props,
  ref: DialogArrow.Props["ref"],
) => {
  const ctx = useDialogRoot();
  const combined = useCombinedRefs(ref, ctx.setArrow as any);

  const comp = useSlot({
    props: [props],
    ref: combined,
    slot: render ?? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 8"
        aria-hidden
        height={8}
        focusable="false"
        {...props}
        ref={combined}
        data-ln-dialog-arrow
      >
        <polygon points="0,8 8,0 16,8" data-ln-dialog-arrow-area />
        <path
          data-ln-dialog-arrow-border
          d="M0 8 L8 0 L16 8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  });

  return comp;
};

export const DialogArrow = forwardRef(DialogArrowBase);

export namespace DialogArrow {
  export type Props = LnComponent<JSX.IntrinsicElements["svg"], object>;
}

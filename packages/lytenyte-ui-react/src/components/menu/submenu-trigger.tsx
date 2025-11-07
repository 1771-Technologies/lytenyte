import { forwardRef, type ComponentProps, type JSX } from "react";
import { Menu as M } from "../../components-headless/menu/index.js";
import { tw } from "../tw.js";
import type { SlotComponent } from "../../hooks/use-slot/+types.use-slot.js";
import { useSlot } from "../../hooks/use-slot/use-slot.js";

export const SubmenuTrigger = forwardRef(
  (
    { expander, ...props }: ComponentProps<typeof M.SubmenuTrigger> & { expander?: SlotComponent },
    ref: JSX.IntrinsicElements["div"]["ref"],
  ) => {
    const icon = useSlot({ slot: expander ?? <span className="iconify ph--caret-right-fill" /> });

    return (
      <M.SubmenuTrigger
        {...props}
        ref={ref}
        className={tw(
          "not-ln-active:ln-open:bg-gray-300/30 ln-active:bg-gray-300/40 flex items-center justify-between",
          "cursor-pointer select-none text-nowrap rounded px-2 py-0.5 focus-visible:outline-none",
          props.className,
        )}
      >
        {props.children}
        {icon}
      </M.SubmenuTrigger>
    );
  },
);

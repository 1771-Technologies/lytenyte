import { clsx } from "@1771technologies/js-utils";
import { forwardRef, useCallback, type JSX, type KeyboardEventHandler } from "react";
import { usePillControls } from "./pill-manager-controls";

export const PillManagerRows = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function PillManagerRows({ onKeyDown: kd, ...props }, ref) {
    const onKeydown: KeyboardEventHandler<HTMLDivElement> = useCallback(
      (ev) => {
        kd?.(ev);

        const targets = Array.from(ev.currentTarget.children)
          .filter((c) => c.getAttribute("data-pill-row-key"))
          .map((c) => [c.getAttribute("data-pill-row-key"), c]);

        if (ev.key === "ArrowUp") {
          console.log(targets);
        } else if (ev.key === "ArrowDown") {
          console.log(targets);
        }
      },
      [kd],
    );

    const { activePill, activeRow } = usePillControls();

    return (
      <div
        {...props}
        onKeyDown={onKeydown}
        tabIndex={0}
        className={clsx("lng1771-pill-manager__rows", props.className)}
        data-active-row={activePill}
        data-active-pill={activeRow}
        ref={ref}
      />
    );
  },
);

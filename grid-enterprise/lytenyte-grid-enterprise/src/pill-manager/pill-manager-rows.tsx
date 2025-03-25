import { clsx } from "@1771technologies/js-utils";
import { forwardRef, useCallback, type JSX, type KeyboardEventHandler } from "react";
import { usePillControls } from "./pill-manager-controls";
import { useGrid } from "../use-grid";

export const PillManagerRows = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function PillManagerRows({ onKeyDown: kd, ...props }, ref) {
    const { activePill, activeRow, setActivePill, setActiveRow } = usePillControls();
    const sx = useGrid();

    const onKeydown: KeyboardEventHandler<HTMLDivElement> = useCallback(
      (ev) => {
        kd?.(ev);

        const targets = Array.from(ev.currentTarget.children)
          .filter((c) => c.getAttribute("data-pill-row-key"))
          .map((c) => [c.getAttribute("data-pill-row-key")!, c as HTMLElement] as const);

        if (targets.length === 0) return;

        const startKey = sx.state.rtl.peek() ? "ArrowRight" : "ArrowLeft";
        const endKey = sx.state.rtl.peek() ? "ArrowLeft" : "ArrowRight";

        const focusPrevActive = (el: HTMLElement) => {
          const pills = Array.from(el.querySelectorAll(`[data-pill-key]`)).map(
            (c) => [c.getAttribute("data-pill-key")!, c as HTMLElement] as const,
          );
          if (!pills.length) {
            setActivePill(null);
            return;
          }
          if (!activePill) {
            setActivePill(pills.at(-1)![0]);
            pills.at(-1)![1].scrollIntoView();
            return;
          }

          const activeIndex = pills.findIndex((c) => c[0] === activePill);
          if (activeIndex === -1 || activeIndex === 0) {
            setActivePill(pills.at(-1)![0]);
            pills.at(-1)![1].scrollIntoView();
            return;
          }

          setActivePill(pills[activeIndex - 1][0]);
          pills[activeIndex - 1][1].scrollIntoView();
        };

        const focusNextActive = (el: HTMLElement) => {
          const pills = Array.from(el.querySelectorAll(`[data-pill-key]`)).map(
            (c) => [c.getAttribute("data-pill-key")!, c as HTMLElement] as const,
          );
          if (!pills.length) {
            setActivePill(null);
            return;
          }
          if (!activePill) {
            setActivePill(pills[0][0]);
            pills[0][1].scrollIntoView();
            return;
          }

          const activeIndex = pills.findIndex((c) => c[0] === activePill);
          if (activeIndex === -1 || activeIndex === pills.length - 1) {
            setActivePill(pills[0][0]);
            pills[0][1].scrollIntoView();
            return;
          }

          setActivePill(pills[activeIndex + 1][0]);
          pills[activeIndex + 1][1].scrollIntoView();
        };

        if (ev.key === "ArrowUp") {
          const currentActive = targets.findIndex((c) => c[0] === activeRow);
          if (currentActive === -1 || currentActive === 0) {
            setActiveRow(targets.at(-1)![0]);
            focusNextActive(targets.at(-1)![1]);
          } else {
            setActiveRow(targets[currentActive - 1][0]);
            focusNextActive(targets[currentActive - 1][1]);
          }
        } else if (ev.key === "ArrowDown") {
          const currentActive = targets.findIndex((c) => c[0] === activeRow);
          if (currentActive === -1 || currentActive === targets.length - 1) {
            setActiveRow(targets[0][0]);
            focusNextActive(targets[0][1]);
          } else {
            setActiveRow(targets[currentActive + 1][0]);
            focusNextActive(targets[currentActive + 1][1]);
          }
        } else if (ev.key === endKey) {
          const currentActive = targets.find((c) => c[0] === activeRow)?.[1];
          if (!currentActive) return;
          focusNextActive(currentActive);
          ev.preventDefault();
          return;
        } else if (ev.key === startKey) {
          const currentActive = targets.find((c) => c[0] === activeRow)?.[1];
          if (!currentActive) return;
          focusPrevActive(currentActive);
          ev.preventDefault();
          return;
        } else if (ev.key === " ") {
          if (!activePill) return;

          const currentActive = targets.find((c) => c[0] === activeRow)?.[1];
          if (!currentActive) return;
          const pill = currentActive.querySelector(
            `[data-pill-key="${activePill}"]`,
          ) as HTMLElement;
          if (!pill) return;
          pill.click();
          ev.preventDefault();
        } else if (ev.key === "x") {
          const currentActive = targets.find((c) => c[0] === activeRow)?.[1];
          if (!currentActive) return;

          const expander = currentActive.querySelector(
            `[data-pill-expander-source]`,
          ) as HTMLElement;
          if (expander) expander.click();
        }
      },
      [activePill, activeRow, kd, setActivePill, setActiveRow, sx.state.rtl],
    );

    return (
      <div
        {...props}
        onKeyDown={onKeydown}
        tabIndex={0}
        onBlur={() => {
          setActiveRow(null);
          setActivePill(null);
        }}
        className={clsx("lng1771-pill-manager__rows", props.className)}
        data-rows-root="true"
        data-active-row={activePill}
        data-active-pill={activeRow}
        ref={ref}
      />
    );
  },
);

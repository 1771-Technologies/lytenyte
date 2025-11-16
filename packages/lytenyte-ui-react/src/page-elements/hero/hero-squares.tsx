import type { PropsWithChildren } from "react";
import { tw } from "../../components/tw.js";
import { FenceDivider } from "../fence-divider.js";
import { HeroIconReact } from "./icon-react.js";
import { HeroIconPivot } from "./icon-pivot.js";
import { HeroIconSum } from "./icon-sum.js";
import { HeroIconHash } from "./icon-hash.js";

export function HeroSquares() {
  return (
    <div className="grid h-full grid-cols-[1fr] md:grid-cols-[50px_1fr_50px]">
      <FenceDivider className="hidden md:block" />
      <div className="grid grid-cols-[3fr_2fr_3fr_2fr_1.5fr_3fr_2fr] grid-rows-[repeat(11,auto)_200px]">
        {/* Row 1 */}
        <SquareRow>
          <EmptyCell cornerStart />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell cornerEnd className="justify-end">
            <HeroIconReact />
          </EmptyCell>
        </SquareRow>

        {/* Row 2 */}
        <SquareRow>
          <EmptyCell>
            <HeroIconPivot />
          </EmptyCell>
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <FilledCell />
          <EmptyCell />
        </SquareRow>

        {/* Row 3 */}
        <SquareRow>
          <EmptyCell plusBottomEnd />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell className="justify-end" plusBottomStart>
            <HeroIconSum />
          </EmptyCell>
        </SquareRow>

        {/* Row 4,5,6 */}
        {Array.from({ length: 3 }, (_, i) => {
          return (
            <SquareRow key={i}>
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
            </SquareRow>
          );
        })}

        {/* Row 7 */}
        <SquareRow>
          <EmptyCell>
            <HeroIconHash />
          </EmptyCell>
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <FilledCell />
        </SquareRow>

        {/* Row 8 */}
        <SquareRow>
          <EmptyCell className="gap-4 bg-gray-200 px-3 dark:bg-gray-200/20" plusBottomEnd>
            <div className="size-6 gap-3 rounded-lg bg-gray-300/50 dark:bg-gray-200/60" />
            <div className="h-3 flex-1 gap-3 rounded-lg bg-gradient-to-r from-gray-300/50 to-transparent dark:from-gray-200/60" />
          </EmptyCell>

          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell plusBottomStart />
          <EmptyCell />
          <EmptyCell />
        </SquareRow>

        {/* Row 9 */}
        <SquareRow>
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell className="justify-end">
            <HeroIconHash />
          </EmptyCell>
        </SquareRow>

        {Array.from({ length: 2 }, (_, i) => {
          return (
            <SquareRow key={i}>
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
            </SquareRow>
          );
        })}

        <div className="h-full" />
      </div>

      <FenceDivider className="hidden md:block" />
    </div>
  );
}
function SquareRow(props: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={tw(
        "col-span-full grid h-[44px] grid-cols-subgrid border-b border-gray-300/40 dark:border-gray-200/50",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

function FilledCell() {
  return (
    <div
      className={tw(
        "relative flex items-center border-r border-gray-300/40 bg-gray-200 px-1 text-gray-300/40 dark:border-gray-200/50 dark:bg-gray-200/20 dark:text-gray-200/50",
      )}
    ></div>
  );
}

function EmptyCell(
  props: PropsWithChildren<{
    cornerStart?: boolean;
    cornerEnd?: boolean;
    className?: string;
    plusBottomEnd?: boolean;
    plusBottomStart?: boolean;
  }>,
) {
  return (
    <div
      className={tw(
        "relative flex items-center border-r border-gray-300/40 px-1 text-gray-300/40 dark:border-gray-200/50 dark:text-gray-200/50",
        props.className,
      )}
    >
      {props.cornerStart && (
        <div className="absolute left-0 top-0 h-3 w-3 border-s border-t border-gray-500 dark:border-gray-300" />
      )}
      {props.cornerEnd && (
        <div className="absolute right-0 top-0 h-3 w-3 border-e border-t border-gray-500 dark:border-gray-300" />
      )}
      {props.plusBottomEnd && (
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-gray-300">
          +
        </div>
      )}
      {props.plusBottomStart && (
        <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-gray-300">
          +
        </div>
      )}

      {props.children}
    </div>
  );
}

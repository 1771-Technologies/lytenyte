import type { RawCode } from "codehike/code";
import { Pre, highlight } from "codehike/code";
import { className as cls } from "./annotations/class-name";
import { collapse } from "./annotations/collapse";
import { CopyButton } from "./annotations/copy-button";
import { mark } from "./annotations/mark";
import { diff } from "./annotations/diff";
import { cn } from "../cn";

export async function Code({
  codeblock,
  className,
  frame,
}: {
  codeblock: RawCode;
  className?: string;
  frame?: boolean;
}) {
  const highlighted = await highlight(codeblock, "github-from-css");

  return (
    <div
      style={{ scrollbarWidth: "thin" }}
      className={cn(
        "bg-fd-secondary/40 dark:bg-fd-secondary relative overflow-auto rounded-xl py-[14px]",
        !frame && "mb-8 border border-gray-300 shadow-xs dark:border-gray-100",
        className,
      )}
    >
      <div className="sticky left-0 w-full">{!frame && <CopyButton text={highlighted.code} />}</div>
      <Pre code={highlighted} handlers={[cls, collapse, diff, mark]} className="text-sm" />
    </div>
  );
}

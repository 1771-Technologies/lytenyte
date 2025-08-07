import { AnnotationHandler, HighlightedCode, Pre } from "codehike/code";
import { tw } from "../../utils";
import { MetaOptions } from "./parse-meta";
import { CopyButton } from "./copy-button";

export function CodeBase({
  highlighted,
  handlers,
  meta,
}: {
  highlighted: HighlightedCode;
  handlers: AnnotationHandler[];
  meta: MetaOptions;
}) {
  return (
    <div className="code-block my-4 flex flex-col rounded-lg border border-gray-200">
      <div className="relative">
        <Pre
          code={highlighted}
          handlers={handlers}
          className={tw(
            !meta.numbers && "px-4",
            meta.numbers && "pr-4",
            "py-3 text-sm font-semibold",
          )}
        />
        {!meta.noCopy && <CopyButton text={highlighted.code} />}
      </div>
    </div>
  );
}

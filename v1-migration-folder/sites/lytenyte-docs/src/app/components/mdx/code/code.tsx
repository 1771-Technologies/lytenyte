import { AnnotationHandler, Pre, RawCode, highlight } from "codehike/code";
import { className } from "./class-name";
import { InlineFold } from "./folded";
import { parseMeta } from "./parse-meta";
import { lineNumbers } from "./line-numbers";
import { tw } from "../../utils";
import { focus } from "./focus";

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-from-css");

  const meta = parseMeta(highlighted.meta);

  const handlers = [className, fold, focus];
  if (meta.numbers) handlers.push(lineNumbers);

  return (
    <div className="code-block my-4 bg-gray-100">
      <Pre
        code={highlighted}
        handlers={handlers}
        className={tw(
          !meta.numbers && "px-4",
          meta.numbers && "pr-4",
          "py-3 text-sm font-semibold",
        )}
      />
    </div>
  );
}

export const fold: AnnotationHandler = {
  name: "fold",
  Inline: InlineFold,
};

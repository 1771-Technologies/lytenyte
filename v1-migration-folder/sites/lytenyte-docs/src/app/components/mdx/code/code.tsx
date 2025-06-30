import { AnnotationHandler, Pre, RawCode, highlight } from "codehike/code";
import { className } from "./class-name";
import { InlineFold } from "./folded";
import { parseMeta } from "./parse-meta";
import { lineNumbers } from "./line-numbers";
import { focus } from "./focus";
import { mark } from "./mark";
import { CodeBase } from "./code-base";

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-from-css");

  const meta = parseMeta(highlighted.meta);

  const handlers = [className, fold, focus, mark];
  if (meta.numbers) handlers.push(lineNumbers);

  return <CodeBase handlers={handlers} meta={meta} highlighted={highlighted} />;
}

export const fold: AnnotationHandler = {
  name: "fold",
  Inline: InlineFold,
};

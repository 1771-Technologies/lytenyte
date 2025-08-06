import { AnnotationHandler, Pre, highlight } from "codehike/code";
import { parseMeta } from "./parse-meta";
import { lineNumbers } from "./line-numbers";
import { Block, CodeBlock, parseProps } from "codehike/blocks";
import { z } from "zod";
import { Tooltip } from "./code-tooltip";
import { CodeBase } from "./code-base";

const Schema = Block.extend({
  code: CodeBlock,
  tooltips: z.array(Block).optional(),
});

export async function CodeWithTooltips(props: unknown) {
  const { code, tooltips = [] } = parseProps(props, Schema);
  const highlighted = await highlight(code, "github-from-css");

  highlighted.annotations = highlighted.annotations.map((a) => {
    const tooltip = tooltips.find((t) => t.title === a.query);
    if (!tooltip) return a;

    return { ...a, data: { ...a.data, children: tooltip.children } };
  });

  const handlers = [tooltip];
  const meta = parseMeta(highlighted.meta);

  if (meta.numbers) handlers.push(lineNumbers);

  return <CodeBase handlers={handlers} meta={meta} highlighted={highlighted} />;
}

export const tooltip: AnnotationHandler = {
  name: "tooltip",
  Inline: ({ children, annotation }) => {
    const { query, data } = annotation;

    return <Tooltip trigger={children}>{data?.children || query}</Tooltip>;
  },
};

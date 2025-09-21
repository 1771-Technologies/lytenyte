import type { RawCode } from "codehike/code";
import { highlight, Inline } from "codehike/code";

export async function InlineCode({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-from-css");
  return <Inline code={highlighted} style={{ ...highlighted.style, background: "transparent" }} />;
}

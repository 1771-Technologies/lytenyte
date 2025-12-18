import { createProcessor } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { VFile } from "vfile";
import {
  remarkCallout,
  remarkDirective,
  remarkLastModified,
  remarkMath,
  remarkStandaloneImage,
} from "../../plugins/index.js";

function createMdxProcessor() {
  return createProcessor({
    remarkPlugins: [
      remarkGfm,
      remarkStandaloneImage,
      remarkDirective,
      remarkCallout,
      remarkLastModified,
      remarkMath,
    ],

    format: "mdx",
    jsxImportSource: "astro",
    elementAttributeNameCase: "html",
  });
}

const processor = createMdxProcessor();
export const renderMdx = async (s: string) => {
  const vfile = new VFile({
    value: s,
  });

  const { value: code } = await processor.process(vfile);

  return String(code);
};

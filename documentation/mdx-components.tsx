import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { createGenerator } from "fumadocs-typescript";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { ProTag } from "./components/company/pro-tag";
import { Code } from "./components/code/code";
import { CodeDemo } from "./components/code/code-demo";

const generator = createGenerator();

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    ...TabsComponents,
    AutoTypeTable: (props) => <AutoTypeTable {...props} generator={generator} />,
    Step,
    Steps,
    ProTag,
    Code,
    CodeDemo,
  };
}

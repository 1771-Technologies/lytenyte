import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { ProTag } from "./components/company/pro-tag";
import { Code } from "./components/code/code";
import { CodeDemo } from "./components/code/code-demo";
import { InlineCode } from "./components/code/code-inline";
import { AutoTypeTable, TT } from "./components/auto-type-table/auto-type-table";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    ...TabsComponents,
    AutoTypeTable,
    TypeTable: TT,
    Step,
    Steps,
    ProTag,
    InlineCode,
    Code,
    CodeDemo,
  };
}

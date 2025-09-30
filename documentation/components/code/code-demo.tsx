import { readFileSync, readdirSync } from "fs";
import { Code } from "./code";
import { type PropsWithChildren } from "react";
import { CodeDemoProvider } from "./code-demo-provider";
import { CodeAccordion } from "./code-accordion";
import { LinkButton } from "../ui/button";
import { StackBlitzIcon } from "../icons/stackblitz-icon";
import { CodeSandboxIcon } from "../icons/codesandbox-icon";
import { Tab } from "fumadocs-ui/components/tabs";
import path from "path";
import { highlight } from "codehike/code";
import { CopyButton } from "./annotations/copy-button";
import { CodeExpandButton } from "./code-expand-button";
import { CodeTabs } from "./code-tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Resettable } from "./resettable";
import { ResetButton } from "./reset-button";
export interface CodeDemoProps {
  readonly title: string | null;
  readonly absolute: string;
  readonly relative: string;
  readonly codeSandbox: string;
  readonly stackBlitz: string;
}
export async function CodeDemo(props: PropsWithChildren<CodeDemoProps>) {
  const files = getOrderedFiles(props.absolute).filter(
    (c) => c.name !== "data.ts" && !c.name.endsWith(".json"),
  );

  const tabs = files.map((c) => c.name);

  const copyContent = await Promise.all(
    files.map(async (c) => {
      const h = await highlight(
        { lang: langType(c.name), meta: "", value: c.content },
        "github-from-css",
      );

      return h.code;
    }),
  );

  return (
    <CodeDemoProvider>
      <div className="flex flex-col overflow-hidden rounded-xl border border-gray-400 shadow dark:border-gray-100">
        <div className="bg-fd-card flex items-center gap-1 p-4">
          {props.title && (
            <h3 className="text-base font-medium text-gray-800" style={{ marginBlock: 0 }}>
              {props.title}
            </h3>
          )}
          <div className="flex-1" />
        </div>
        <div className="text-gray border-y border-gray-400 dark:border-gray-100">
          <Resettable>{props.children}</Resettable>
        </div>
        <div className="relative">
          <CodeTabs tabs={tabs}>
            <CodeAccordion copySlot>
              {files.map((c, i) => {
                return (
                  <Tab
                    value={c.name}
                    key={c.name}
                    style={{ padding: 0 }}
                    className="rounded-none bg-gray-50"
                  >
                    <TooltipProvider disableHoverableContent>
                      <div className="absolute right-[42px] top-[-34px] flex items-center gap-2">
                        <CodeExpandButton />

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ResetButton />
                          </TooltipTrigger>
                          <TooltipContent>Reset Demo</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <LinkButton
                              href={props.stackBlitz}
                              size="icon-xs"
                              color="ghost"
                              target="_blank"
                              className="text-gray-800 dark:text-gray-600"
                            >
                              <StackBlitzIcon />
                            </LinkButton>
                          </TooltipTrigger>
                          <TooltipContent>Edit in StackBlitz</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <LinkButton
                              href={props.codeSandbox}
                              size="icon-xs"
                              color="ghost"
                              target="_blank"
                              className="text-gray-800 dark:text-gray-600"
                            >
                              <CodeSandboxIcon />
                            </LinkButton>
                          </TooltipTrigger>
                          <TooltipContent>Edit in CodeSandbox</TooltipContent>
                        </Tooltip>
                      </div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CopyButton className="top-[-32px]" text={copyContent[i]} />
                        </TooltipTrigger>
                        <TooltipContent>Copy Code Content</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Code
                      frame
                      codeblock={{ lang: langType(c.name), meta: "", value: c.content }}
                      className="border-transparent py-2 dark:border-transparent"
                    />
                  </Tab>
                );
              })}
            </CodeAccordion>
          </CodeTabs>
        </div>
      </div>
    </CodeDemoProvider>
  );
}

/**
 * Reads the given directory and returns files with their contents.
 * - Only direct files (no subdirectories).
 * - Orders by: `component.*` first, then tsx, ts, css, then everything else.
 *
 * @param {string} dirPath - Path to the directory
 * @returns {Array<{ name: string, content: string }>}
 */
function getOrderedFiles(dirPath: string) {
  const files = readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile()) // exclude folders
    .map((entry) => entry.name);

  const priorityOrder = ["tsx", "ts", "css"];

  // Custom sort
  files.sort((a, b) => {
    const aBase = path.parse(a).name.toLowerCase();
    const bBase = path.parse(b).name.toLowerCase();

    // 1. component.* files always first
    if (aBase === "demo" && bBase !== "demo") return -1;
    if (bBase === "demo" && aBase !== "demo") return 1;

    // 2. Compare by extension priority
    const aExt = path.extname(a).slice(1); // remove dot
    const bExt = path.extname(b).slice(1);

    const aIndex = priorityOrder.indexOf(aExt);
    const bIndex = priorityOrder.indexOf(bExt);

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // 3. Otherwise alphabetical
    return a.localeCompare(b);
  });

  // Read contents
  return files.map((file) => ({
    name: file,
    content: readFileSync(path.join(dirPath, file), "utf8"),
  }));
}

function langType(c: string) {
  if (c.endsWith(".tsx")) return "tsx";
  if (c.endsWith(".ts")) return "ts";
  if (c.endsWith(".js")) return "js";
  if (c.endsWith(".jsx")) return "jsx";
  if (c.endsWith(".css")) return "css";
  if (c.endsWith(".html")) return "html";

  return "txt";
}

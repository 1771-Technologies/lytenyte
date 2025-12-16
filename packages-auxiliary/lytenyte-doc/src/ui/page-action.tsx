import { useState } from "react";
import { cn } from "./cn.js";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipRoot } from "./tooltip.js";
import { Menu as M } from "@base-ui/react";

export function PageAction({
  githubOrg,
  githubRepo,
  rootDir,
  branch,
  path,
}: {
  githubOrg: string;
  githubRepo: string;
  rootDir: string;
  branch: string;
  path: string;
  collection: string;
  id: string;
}) {
  const url = typeof window !== "undefined" ? new URL(window.location.href) : "";
  const fullMarkdownUrl =
    typeof window !== "undefined" ? new URL(url, window.location.origin) : "loading";
  const q = `Read ${fullMarkdownUrl}, I want to ask questions about it.`;

  const [copying, setCopying] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <div className="border-xd-border bg-xd-accent/60 flex items-center rounded-lg">
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger
            className="hover:bg-xd-accent cursor-pointer transition-colors hover:rounded-s-lg"
            onClick={async () => {
              if (success) return;
              let t;
              try {
                t = setTimeout(() => {
                  setCopying(true);
                }, 100);
                const result = await (await fetch(`${window.location.pathname}.mdx`)).text();

                await navigator.clipboard.writeText(result);

                setSuccess(true);
                setTimeout(() => {
                  setSuccess(false);
                }, 2000);
              } finally {
                clearTimeout(t);
                setCopying(false);
              }
            }}
          >
            {!copying && !success && <span className="iconify ph--copy size-4" />}
            {copying && <span className="iconify svg-spinners--90-ring size-4"></span>}
            {success && (
              <span className="iconify ph--check size-4 text-green-900 dark:text-green-500"></span>
            )}
            <span className="hidden md:inline">Copy Page</span>
          </TooltipTrigger>
          <Tooltip side="bottom">Copy page as MarkDown</Tooltip>
        </TooltipRoot>
      </TooltipProvider>
      <M.Root>
        <M.Trigger className="center border-xd-border hover:bg-xd-accent cursor-pointer border-s px-2 py-2 transition-colors hover:rounded-e-lg">
          <span className="iconify ph--caret-down relative -left-px"></span>
          <span className="sr-only">Open additional page export options</span>
        </M.Trigger>
        <M.Portal>
          <M.Positioner side="bottom" sideOffset={6}>
            <M.Popup
              className={cn(
                "origin-(--transform-origin) bg-xd-popover border-xd-border text-xd-popover-foreground border px-2 py-1",
                "data-ending-style:opacity-0 data-starting-style:opacity-0 rounded-lg shadow-lg",
                "data-ending-style:scale-90 data-starting-style:scale-90 transition-[transform,scale,opacity]",
                "grid grid-cols-[auto_1fr_auto] gap-x-2",
              )}
            >
              <M.Item
                render={
                  <a
                    href={`https://github.com/${githubOrg}/${githubRepo}/blob/${branch}/${rootDir}/${path}`}
                    target="_blank"
                  />
                }
                className="hover:bg-xd-accent col-span-full grid cursor-pointer grid-cols-subgrid items-center rounded-lg px-2 py-2 text-sm font-semibold"
              >
                <span className="iconify logos--github-icon size-4"></span>
                <span className="relative pr-4">Open in Github</span>
                <span className="iconify ph--arrow-square-out size-4"></span>
              </M.Item>
              <M.Item
                render={
                  <a
                    href={`https://chatgpt.com/?${new URLSearchParams({
                      hints: "search",
                      q,
                    })}`}
                    target="_blank"
                  />
                }
                className="hover:bg-xd-accent col-span-full grid cursor-pointer grid-cols-subgrid items-center rounded-lg px-2 py-2 text-sm font-semibold"
              >
                <span className="iconify logos--openai-icon size-4"></span>
                <span className="relative pr-4">Open in ChatGPT</span>
                <span className="iconify ph--arrow-square-out size-4"></span>
              </M.Item>
              <M.Item
                render={
                  <a
                    href={`https://claude.ai/new?${new URLSearchParams({
                      q,
                    })}`}
                    target="_blank"
                  />
                }
                className="hover:bg-xd-accent col-span-full grid cursor-pointer grid-cols-subgrid items-center rounded-lg px-2 py-2 text-sm font-semibold"
              >
                <span className="iconify logos--anthropic-icon size-4"></span>
                <span className="relative pr-4">Open in Claude</span>
                <span className="iconify ph--arrow-square-out size-4"></span>
              </M.Item>
              <M.Item
                render={
                  <a
                    href={`https://scira.ai/?${new URLSearchParams({
                      q,
                    })}`}
                    target="_blank"
                  />
                }
                className="hover:bg-xd-accent col-span-full grid cursor-pointer grid-cols-subgrid items-center rounded-lg px-2 py-2 text-sm font-semibold"
              >
                <span className="size-4">
                  <svg viewBox="0 0 910 934" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M647.664 197.775C569.13 189.049 525.5 145.419 516.774 66.8849C508.048 145.419 464.418 189.049 385.884 197.775C464.418 206.501 508.048 250.131 516.774 328.665C525.5 250.131 569.13 206.501 647.664 197.775Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M516.774 304.217C510.299 275.491 498.208 252.087 480.335 234.214C462.462 216.341 439.058 204.251 410.333 197.775C439.059 191.3 462.462 179.209 480.335 161.336C498.208 143.463 510.299 120.06 516.774 91.334C523.25 120.059 535.34 143.463 553.213 161.336C571.086 179.209 594.49 191.3 623.216 197.775C594.49 204.251 571.086 216.341 553.213 234.214C535.34 252.087 523.25 275.491 516.774 304.217Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M857.5 508.116C763.259 497.644 710.903 445.288 700.432 351.047C689.961 445.288 637.605 497.644 543.364 508.116C637.605 518.587 689.961 570.943 700.432 665.184C710.903 570.943 763.259 518.587 857.5 508.116Z"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M700.432 615.957C691.848 589.05 678.575 566.357 660.383 548.165C642.191 529.973 619.499 516.7 592.593 508.116C619.499 499.533 642.191 486.258 660.383 468.066C678.575 449.874 691.848 427.181 700.432 400.274C709.015 427.181 722.289 449.874 740.481 468.066C758.673 486.258 781.365 499.533 808.271 508.116C781.365 516.7 758.673 529.973 740.481 548.165C722.289 566.357 709.015 589.05 700.432 615.957Z"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M889.949 121.237C831.049 114.692 798.326 81.9698 791.782 23.0692C785.237 81.9698 752.515 114.692 693.614 121.237C752.515 127.781 785.237 160.504 791.782 219.404C798.326 160.504 831.049 127.781 889.949 121.237Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M791.782 196.795C786.697 176.937 777.869 160.567 765.16 147.858C752.452 135.15 736.082 126.322 716.226 121.237C736.082 116.152 752.452 107.324 765.16 94.6152C777.869 81.9065 786.697 65.5368 791.782 45.6797C796.867 65.5367 805.695 81.9066 818.403 94.6152C831.112 107.324 847.481 116.152 867.338 121.237C847.481 126.322 831.112 135.15 818.403 147.858C805.694 160.567 796.867 176.937 791.782 196.795Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M760.632 764.337C720.719 814.616 669.835 855.1 611.872 882.692C553.91 910.285 490.404 924.255 426.213 923.533C362.022 922.812 298.846 907.419 241.518 878.531C184.19 849.643 134.228 808.026 95.4548 756.863C56.6815 705.7 30.1238 646.346 17.8129 583.343C5.50207 520.339 7.76433 455.354 24.4266 393.359C41.089 331.364 71.7099 274.001 113.947 225.658C156.184 177.315 208.919 139.273 268.117 114.442"
                      stroke="currentColor"
                      strokeWidth="30"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="relative pr-4">Open in Scira AI</span>
                <span className="iconify ph--arrow-square-out size-4"></span>
              </M.Item>
            </M.Popup>
          </M.Positioner>
        </M.Portal>
      </M.Root>
    </div>
  );
}

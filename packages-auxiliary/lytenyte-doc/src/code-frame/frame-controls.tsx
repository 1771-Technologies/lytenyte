import { TooltipRoot, TooltipProvider, TooltipTrigger, Tooltip } from "../ui/tooltip.js";
import { parseExpressiveCode } from "../parts/parse-text.js";

export function FrameControls({
  codeSandbox,
  files,
  stackBlitz,
}: {
  files: Record<string, string>;
  codeSandbox: string;
  stackBlitz: string;
}) {
  return (
    <>
      <button className="cf-expand-btn center flex cursor-pointer items-center gap-1 rounded-lg px-1.5 py-1.5 text-[12px] transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">
        <span className="iconify ph--arrows-out-simple block size-4 group-data-[expanded=true]:hidden"></span>
        <span className="iconify ph--arrows-in-simple block size-4 group-data-[expanded=false]:hidden"></span>
        <span className="hidden group-data-[expanded=false]:block">Expand Code</span>
        <span className="block group-data-[expanded=false]:hidden">Collapse Code</span>
      </button>

      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger className="center xd-resetter size-7 cursor-pointer rounded-lg transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">
            <span className="sr-only">Reset the demo to the initial state</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          </TooltipTrigger>
          <Tooltip side="bottom">Reset Demo</Tooltip>
        </TooltipRoot>

        <TooltipRoot>
          <TooltipTrigger
            className="center size-7 cursor-pointer rounded-lg transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
            render={
              <a
                href={stackBlitz}
                target="_blank"
                className="center text-xd-foreground size-7 cursor-pointer rounded-lg transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                <span className="sr-only">Fork code on stack blitz</span>
                <span className="iconify logos--stackblitz-icon size-4"></span>
              </a>
            }
          ></TooltipTrigger>
          <Tooltip side="bottom">Edit in StackBlitz</Tooltip>
        </TooltipRoot>

        <TooltipRoot>
          <TooltipTrigger
            className="center size-7 cursor-pointer rounded-lg transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
            render={
              <a
                href={codeSandbox}
                target="_blank"
                className="center text-xd-foreground size-7 cursor-pointer rounded-lg transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                <span className="sr-only">Fork code on code sandbox</span>
                <span className="iconify ph--codesandbox-logo-duotone size-4"></span>
              </a>
            }
          />
          <Tooltip side="bottom">Edit in CodeSandbox</Tooltip>
        </TooltipRoot>

        <TooltipRoot>
          <TooltipTrigger
            className="center group relative top-px size-7 cursor-pointer rounded-lg transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
            onClick={(ev) => {
              const btn = ev.currentTarget;

              let root = btn as HTMLElement;
              while (root && !root.classList.contains("cf-root")) {
                root = root.parentElement!;
              }
              if (!root) return;

              const file = Array.from(root.querySelectorAll("li.tab a"))
                .filter((x) => x.getAttribute("aria-selected") === "true")
                .map((x) => x.textContent.trim())[0];

              if (!file) return;

              const content = files[file];
              if (!content) return;

              const parsed = parseExpressiveCode(content);

              navigator.clipboard.writeText(parsed.code);

              btn.setAttribute("data-active", "true");
              btn.disabled = true;

              setTimeout(() => {
                btn.setAttribute("data-active", "false");
                btn.disabled = false;
              }, 2000);
            }}
          >
            <span className="iconify ph--copy-duotone size-4.5 group-data-[active=true]:hidden"></span>
            <span className="iconify ph--check size-4.5 hidden text-green-500 group-data-[active=true]:block"></span>
          </TooltipTrigger>
          <Tooltip side="bottom">Copy Code Content</Tooltip>
        </TooltipRoot>
      </TooltipProvider>
    </>
  );
}

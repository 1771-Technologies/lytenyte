import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip.js";
import { parseExpressiveCode } from "./parse-text.js";

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
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="center ln-resetter size-7 cursor-pointer rounded-lg transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">
              <span className="sr-only">Reset the demo to the initial state</span>
              <span className="iconify ph--arrows-counter-clockwise-duotone size-4.5"></span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Reset Demo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={codeSandbox}
              target="_blank"
              className="center text-ln-foreground size-7 cursor-pointer rounded-lg transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <span className="sr-only">Fork code on code sandbox</span>
              <span className="iconify ph--codesandbox-logo-duotone size-4.5"></span>
            </a>
          </TooltipTrigger>
          <TooltipContent>Edit in CodeSandbox</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={stackBlitz}
              target="_blank"
              className="center text-ln-foreground size-7 cursor-pointer rounded-lg transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <span className="sr-only">Fork code on stack blitz</span>
              <span className="iconify logos--stackblitz-icon size-4.5"></span>
            </a>
          </TooltipTrigger>
          <TooltipContent>Edit in StackBlitz</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
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
            </button>
          </TooltipTrigger>
          <TooltipContent>Copy Code Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

import type { MarkdownHeading } from "astro";
import { cn } from "../ui/cn.js";
import { useEffect, useRef, useState } from "react";

export function MobileToc({ toc }: { toc: MarkdownHeading[] }) {
  const [open, setOpen] = useState(false);
  const opened = useRef(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    if (!opened.current) {
      opened.current = true;
      setTimeout(() => {
        document.dispatchEvent(new Event("toc-reapply", { bubbles: false }));
      });
    }

    const controller = new AbortController();
    document.addEventListener(
      "pointerdown",
      (ev) => {
        const element = document.elementFromPoint(ev.clientX, ev.clientY);
        if (ref.current?.contains(element)) return;

        setOpen(false);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [open]);

  return (
    <div className="bg-xd-background border-xd-border relative border-b px-4 py-2 md:hidden" ref={ref}>
      <button
        className="text-xd-muted-foreground flex w-full items-center gap-2 text-sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="iconify ph--text-align-left-light size-4" />
        On this page
      </button>

      <div
        className={cn(
          "absolute left-0 z-10 mt-2 grid w-full grid-rows-[0fr] gap-1.5 overflow-hidden text-sm transition-all",
          open && "grid-rows-[1fr]",
        )}
        id="toc"
      >
        <div className="min-h-[0px]">
          {open && (
            <div className="border-xd-border bg-xd-background flex flex-col gap-1.5 rounded-b-xl border-b border-t py-2">
              {toc.map((x) => {
                return (
                  <a
                    onClick={(ev) => {
                      setOpen(false);

                      ev.preventDefault();
                    }}
                    key={`#${x.slug}`}
                    className={cn(
                      x.depth === 3 ? "pl-6" : "pl-3",
                      (opened.current || open) && "toc-link",
                      "text-xd-muted-foreground hover:text-xd-accent-foreground cursor-pointer py-0.5 transition-colors",
                      "data-[active=true]:text-xd-foreground",
                    )}
                    href={`#${x.slug}`}
                  >
                    {x.text}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

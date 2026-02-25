import { Dialog as D } from "@base-ui/react";
import { cn } from "../ui/cn.js";
import { useEffect, useState, type PropsWithChildren } from "react";

export function SidebarDialog(props: PropsWithChildren) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const els = el?.querySelectorAll(".xd-collapse-btn");

    const controller = new AbortController();
    els?.forEach((btn) => {
      const root = btn.parentElement?.parentElement as HTMLElement;
      const id = root.getAttribute("data-group-id");

      btn.addEventListener(
        "click",
        () => {
          const expanded = root.getAttribute("data-collapsed") === "true";
          if (expanded) root.setAttribute("data-collapsed", "false");
          else root.setAttribute("data-collapsed", "true");

          if (id) localStorage.setItem(`nav_group:${id}`, expanded ? "false" : "true");
        },
        { signal: controller.signal },
      );
    });

    return () => controller.abort();
  }, [el]);

  return (
    <D.Root>
      <D.Trigger className="center hover:bg-xd-accent text-xd-foreground size-7 rounded-lg transition-colors xl:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="relative top-px"
        >
          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          <path d="M9 3v18"></path>
        </svg>
        <span className="sr-only">Open main navigation</span>
      </D.Trigger>
      <D.Portal keepMounted>
        <D.Backdrop
          className={cn(
            "backdrop-blur-xs bg-fd-overlay data-open:animate-xd-fade-in",
            "data-closed:animate-xd-fade-out fixed inset-0 z-40",
          )}
        />
        <D.Popup
          ref={setEl}
          className={cn(
            "data-starting-style:translate-x-full data-ending-style:translate-x-full border-xd-border fixed end-0 top-0 z-50 h-full w-4/5 border-s bg-white px-2 py-4 transition-transform dark:bg-black",
            "no-scrollbar overflow-auto",
          )}
        >
          <D.Close className="center hover:bg-xd-accent absolute right-4 top-7 size-7 rounded-lg transition-colors">
            <span className="iconify ph--x size-5" />
          </D.Close>

          {props.children}
        </D.Popup>
      </D.Portal>
    </D.Root>
  );
}

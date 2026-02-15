import { Dialog as D, Autocomplete as A } from "@base-ui/react";
import { cn } from "../ui/cn.js";
import { Fragment, useEffect, useRef, useState } from "react";
import { makeSearcher, type DocIndex } from "./flex-search.js";

export function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<DocIndex[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<(s: string) => Promise<DocIndex[]>>(null);
  const [open, setOpen] = useState(false);

  const { contains } = A.useFilter({ sensitivity: "base" });

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "/") {
        setOpen(true);
      }
    });
  }, []);

  useEffect(() => {
    const getSearchIndex = async () => {
      try {
        const resp = await fetch("/search.json", { cache: "default" });
        const results = await resp.json();

        const searcher = makeSearcher(results);

        searchRef.current = searcher;
      } catch {
        // TODO;
      }
    };
    getSearchIndex();
  }, []);

  useEffect(() => {
    if (!searchValue) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    let ignore = false;

    async function findDoc() {
      try {
        if (!searchRef.current) return;
        const results = await searchRef.current(searchValue);
        if (!ignore) {
          setSearchResults(results);
        }
      } catch {
        if (!ignore) {
          setError("Failed to search docs. Please try again.");
          setSearchResults([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    const timeoutId = setTimeout(findDoc, 300);

    return () => {
      clearTimeout(timeoutId);
      ignore = true;
    };
  }, [contains, searchValue]);

  let status: React.ReactNode = `${searchResults.length} result${searchResults.length === 1 ? "" : "s"} found`;
  if (isLoading) {
    status = (
      <Fragment>
        <div
          className="size-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-600"
          aria-hidden
        />
        Searching...
      </Fragment>
    );
  } else if (error) {
    status = error;
  } else if (searchResults.length === 0 && searchValue) {
    status = `No search results for "${searchValue}"`;
  }

  const shouldRenderPopup = searchValue !== "";

  const [divWidth, setDivWidth] = useState(0);

  return (
    <D.Root
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(x) => {
        if (!x) {
          setSearchResults([]);
          setSearchValue("");
          setError(null);
          setIsLoading(false);
        }
      }}
    >
      <D.Trigger className="md:border-xd-border md:bg-xd-card focus-visible:outline-xd-accent-foreground flex items-center gap-2 rounded-xl py-1.5 pe-2 ps-2 text-sm focus-visible:outline md:border md:pe-3">
        <span className="iconify ph--magnifying-glass size-5 md:size-4"></span>
        <span className="hidden pe-32 md:block">Search</span>
        <div className="md:center hidden gap-1">
          <ModKey
            className="border-xd-border center text-xd-muted-foreground size-5 rounded border"
            isSlash
          />
          {/* <kbd className="relative text-xs">K</kbd> */}
        </div>
      </D.Trigger>
      <D.Portal>
        <D.Backdrop
          className={cn(
            "backdrop-blur-xs bg-fd-overlay data-open:animate-xd-fade-in",
            "data-closed:animate-xd-fade-out fixed inset-0 z-50",
          )}
        />
        <D.Viewport>
          <D.Popup
            className={cn(
              "transition-all",
              "data-ending-style:scale-90 data-starting-style:scale-90 duration-150",
              "data-ending-style:opacity-0 data-starting-style:opacity-0 z-50",
              "bg-xd-popover text-xd-popover-foreground fixed left-1/2 top-4 z-50",
              "w-[calc(100%-1rem)] max-w-screen-sm -translate-x-1/2 overflow-hidden",
              "border-xd-border rounded-t-xl border shadow-2xl shadow-black/50 md:top-[25%]",
              !shouldRenderPopup && "rounded-b-xl",
            )}
          >
            <D.Title className="sr-only">Search the documentation</D.Title>
            <D.Description className="sr-only">
              Search across the full documentation to find something you are looking for.
            </D.Description>

            <A.Root
              items={searchResults}
              value={searchValue}
              onValueChange={setSearchValue}
              itemToStringValue={(item) => item.link}
              filter={null}
            >
              <div
                className="flex items-center gap-2 pe-2 ps-3"
                ref={(el) => {
                  if (!el) return;

                  setDivWidth(el.offsetWidth);
                }}
              >
                <span className="iconify ph--magnifying-glass-duotone relative size-5"></span>
                <A.Input className="flex-1 px-2 py-3 focus:outline-none" placeholder="Search" />
                <D.Close className="border-xd-border hover:bg-xd-accent rounded-lg border p-1 px-2 font-mono text-sm transition-colors">
                  ESC
                </D.Close>
              </div>

              {shouldRenderPopup && (
                <A.Portal>
                  <A.Positioner className="z-50 outline-none" align="start" alignOffset={-40}>
                    <A.Popup
                      className={cn(
                        "border-xd-border z-50 max-h-[min(var(--available-height),23rem)] border-t",
                        "no-scrollbar scroll-pb-2 scroll-pt-2 overflow-y-auto overscroll-contain",
                        "bg-xd-popover text-xd-popover-foreground rounded-b-xl py-2 shadow-lg",
                      )}
                      style={{ width: divWidth }}
                      aria-busy={isLoading || undefined}
                    >
                      <A.Status className="flex items-center gap-2 py-1 pl-4 pr-8 text-sm text-gray-600">
                        {status}
                      </A.Status>
                      <A.List className="px-2 py-1">
                        {(doc: DocIndex) => (
                          <A.Item
                            key={doc.link}
                            render={<a href={"/" + doc.link} className="block" />}
                            className={cn(
                              "select-none overflow-hidden rounded-xl px-2 py-2 text-base leading-4 outline-none",
                              "data-highlighted:bg-xd-accent",
                            )}
                            value={doc}
                          >
                            <div className="flex h-full w-full flex-col gap-1">
                              <div className="flex gap-1 font-medium leading-5">
                                <div className="center">
                                  {Array.from({ length: doc.depth }, (_, i) => {
                                    return (
                                      <span
                                        className="iconify ph--hash-duotone not-first:ms-[-3px] size-4"
                                        key={i}
                                      ></span>
                                    );
                                  })}
                                </div>

                                <div>
                                  <Highlight text={doc.header} query={searchValue} />
                                </div>
                              </div>
                              <div className="text-xd-muted-foreground text-sm leading-4">
                                <Highlight text={doc.text.slice(0, 180)} query={searchValue} />
                                {doc.text.length > 180 && "..."}
                              </div>
                            </div>
                          </A.Item>
                        )}
                      </A.List>
                    </A.Popup>
                  </A.Positioner>
                </A.Portal>
              )}
            </A.Root>
          </D.Popup>
        </D.Viewport>
      </D.Portal>
    </D.Root>
  );
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const re = new RegExp(`(${escapeRegExp(q)})`, "ig");
  const parts = text.split(re);

  return (
    <>
      {parts.map((part, i) =>
        re.test(part) ? (
          <mark key={i} className="bg-transparent px-0 font-semibold text-emerald-500 underline">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * Renders the correct "modifier key" for the user's OS:
 * - macOS: ⌘ (Command)
 * - Windows/Linux/other: Ctrl
 */
export function ModKey({
  showSymbolOnMac = true,
  isSlash,
  className,
}: {
  showSymbolOnMac?: boolean;
  isSlash?: boolean;
  className?: string;
}) {
  if (isSlash) {
    return (
      <kbd className={className} aria-label="Search">
        /
      </kbd>
    );
  }
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.platform);

  if (isMac) {
    return (
      <kbd className={className} aria-label="Command key">
        {showSymbolOnMac ? "⌘" : "Cmd"}
      </kbd>
    );
  }

  return (
    <kbd className={className} aria-label="Control key">
      Ctrl
    </kbd>
  );
}

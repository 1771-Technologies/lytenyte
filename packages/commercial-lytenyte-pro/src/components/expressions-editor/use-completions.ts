import { useState, useEffect, useMemo, useRef, type RefObject } from "react";
import type { ChangeEvent, KeyboardEvent, SyntheticEvent, UIEvent } from "react";
import { useEvent } from "@1771technologies/lytenyte-core/internal";
import type { ExpressionEditorRoot } from "./root.js";
import type { Completion, CompletionContext, CompletionProvider } from "./types.js";

export interface UseCompletionsOptions {
  readonly expression: string;
  readonly onExpressionChange: (value: string) => void;
  readonly tokens: ExpressionEditorRoot.Token[];
  readonly inputRef: RefObject<HTMLTextAreaElement | null>;
  readonly highlightRef: RefObject<HTMLDivElement | null>;
  readonly completionProviders?: CompletionProvider[];
  readonly getCompletions?: (ctx: CompletionContext) => Completion[] | null | Promise<Completion[] | null>;
}

export interface UseCompletionsResult {
  readonly completions: Completion[];
  readonly activeIndex: number;
  readonly isCompletionsLoading: boolean;
  readonly cursorCoords: { top: number; left: number } | null;
  readonly acceptCompletion: (index?: number) => void;
  readonly dismissCompletions: () => void;
  readonly inputProps: {
    readonly value: string;
    readonly onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    readonly onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
    readonly onSelect: (e: SyntheticEvent<HTMLTextAreaElement>) => void;
    readonly onScroll: (e: UIEvent<HTMLTextAreaElement>) => void;
  };
}

function measureCursorCoords(ta: HTMLTextAreaElement, index: number): { top: number; left: number } {
  const mirror = document.createElement("div");
  const cs = getComputedStyle(ta);
  const props = [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "lineHeight",
    "letterSpacing",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopWidth",
    "borderLeftWidth",
    "boxSizing",
    "whiteSpace",
    "wordBreak",
    "overflowWrap",
    "tabSize",
  ];
  for (const prop of props) {
    (mirror.style as unknown as Record<string, string>)[prop] = (cs as unknown as Record<string, string>)[
      prop
    ];
  }
  const taRect = ta.getBoundingClientRect();
  mirror.style.position = "fixed";
  mirror.style.top = `${taRect.top}px`;
  mirror.style.left = `${taRect.left}px`;
  mirror.style.width = `${taRect.width}px`;
  mirror.style.visibility = "hidden";
  mirror.style.pointerEvents = "none";
  mirror.style.overflow = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordBreak = "break-word";
  const before = document.createTextNode(ta.value.slice(0, index));
  const caret = document.createElement("span");
  caret.textContent = "\u200b";
  mirror.appendChild(before);
  mirror.appendChild(caret);
  document.body.appendChild(mirror);
  const caretRect = caret.getBoundingClientRect();
  document.body.removeChild(mirror);
  return {
    top: caretRect.bottom - taRect.top - ta.scrollTop,
    left: caretRect.left - taRect.left - ta.scrollLeft,
  };
}

// Stable empty array — prevents new reference every render when no providers are passed
const NO_PROVIDERS: CompletionProvider[] = [];

export function useCompletions({
  expression,
  onExpressionChange,
  inputRef,
  highlightRef,
  completionProviders = NO_PROVIDERS,
  getCompletions: getCompletionsFn,
}: UseCompletionsOptions): UseCompletionsResult {
  const hasProviders = completionProviders.length > 0 || !!getCompletionsFn;

  const [cursor, setCursor] = useState(0);
  const [dismissedAt, setDismissedAt] = useState<string | null>(null);
  const [forceOpen, setForceOpen] = useState(false);

  // number | null primitive — value equality in deps avoids object reference churn
  const wordStart = useMemo((): number | null => {
    if (!hasProviders) return null;
    if (!forceOpen && dismissedAt === expression) return null;
    let start = cursor;
    while (start > 0 && /\w/.test(expression[start - 1])) start--;
    return expression.slice(start, cursor) ? start : null;
  }, [hasProviders, forceOpen, dismissedAt, expression, cursor]);

  // ─── Completions ────────────────────────────────────────────────────────────

  const [completions, setCompletions] = useState<Completion[]>([]);
  const [isCompletionsLoading, setIsCompletionsLoading] = useState(false);

  // Keep latest provider references in refs so unstable caller-side references
  // (inline functions, un-memoized arrays) don't appear in effect deps
  const completionProvidersRef = useRef(completionProviders);
  completionProvidersRef.current = completionProviders;
  const getCompletionsFnRef = useRef(getCompletionsFn);
  getCompletionsFnRef.current = getCompletionsFn;

  useEffect(() => {
    const hasWord = wordStart !== null;
    const word = hasWord ? expression.slice(wordStart!, cursor) : "";

    if (!forceOpen && !hasWord) {
      setCompletions((prev) => (prev.length === 0 ? prev : []));
      setIsCompletionsLoading((prev) => (prev ? false : prev));
      return;
    }

    let cancelled = false;

    const ctx: CompletionContext = {
      expression,
      cursor,
      word,
      wordStart: wordStart ?? cursor,
      wordEnd: cursor,
    };

    const syncResults: Completion[] = [];
    const pending: Promise<Completion[] | null>[] = [];

    for (const provider of completionProvidersRef.current) {
      const r = provider.getCompletions(ctx);
      if (r instanceof Promise) pending.push(r);
      else if (r) syncResults.push(...r);
    }
    const fn = getCompletionsFnRef.current;
    if (fn) {
      const r = fn(ctx);
      if (r instanceof Promise) pending.push(r);
      else if (r) syncResults.push(...r);
    }

    function applyFilter(results: Completion[]): Completion[] {
      if (forceOpen && !hasWord) return results;
      return results.filter((c) => (c.insertText ?? c.label).toLowerCase().startsWith(word.toLowerCase()));
    }

    setCompletions(applyFilter(syncResults));

    if (!pending.length) {
      setIsCompletionsLoading(false);
      return;
    }

    setIsCompletionsLoading(true);
    Promise.all(pending).then((results) => {
      if (cancelled) return;
      const all = [...syncResults];
      for (const r of results) if (r) all.push(...r);
      setCompletions(applyFilter(all));
      setIsCompletionsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [forceOpen, wordStart, cursor, expression]);

  // ─── Active index ────────────────────────────────────────────────────────────

  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    setActiveIndex(0);
  }, [completions.length]);

  // ─── Cursor pixel coords ─────────────────────────────────────────────────────

  const [cursorCoords, setCursorCoords] = useState<{ top: number; left: number } | null>(null);
  useEffect(() => {
    if (!inputRef.current || (!completions.length && !isCompletionsLoading)) {
      setCursorCoords(null);
      return;
    }
    setCursorCoords(measureCursorCoords(inputRef.current, cursor));
  }, [cursor, completions.length, isCompletionsLoading, inputRef]);

  // ─── Actions ─────────────────────────────────────────────────────────────────

  const acceptCompletion = useEvent((index?: number) => {
    const i = index ?? activeIndex;
    const completion = completions[i];
    if (!completion) return;
    const insert = completion.insertText ?? completion.label;
    const start = wordStart ?? cursor;
    const newExpression = expression.slice(0, start) + insert + expression.slice(cursor);
    const newCursor = start + insert.length;
    onExpressionChange(newExpression);
    setDismissedAt(newExpression);
    setForceOpen(false);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursor, newCursor);
        setCursor(newCursor);
      }
    });
  });

  const dismissCompletions = useEvent(() => {
    setDismissedAt(expression);
    setForceOpen(false);
  });

  // ─── Event handlers ──────────────────────────────────────────────────────────

  const handleChange = useEvent((e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.replace(/[\r\n]/g, "");
    onExpressionChange(value);
    setCursor(e.target.selectionStart ?? value.length);
    setForceOpen(false);
  });

  const handleKeyDown = useEvent((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === " ") {
      if (!hasProviders) return;
      e.preventDefault();
      setForceOpen(true);
      setDismissedAt(null);
      return;
    }

    // Always prevent Enter from inserting a newline (single-line editor)
    if (e.key === "Enter") {
      e.preventDefault();
      if (completions.length) acceptCompletion();
      return;
    }

    if (!completions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % completions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + completions.length) % completions.length);
    } else if (e.key === "Tab") {
      e.preventDefault();
      acceptCompletion();
    } else if (e.key === "Escape") {
      e.preventDefault();
      dismissCompletions();
    }
  });

  const handleSelect = useEvent((e: SyntheticEvent<HTMLTextAreaElement>) => {
    setCursor((e.target as HTMLTextAreaElement).selectionStart ?? 0);
  });

  const handleScroll = useEvent((e: UIEvent<HTMLTextAreaElement>) => {
    if (highlightRef.current) {
      const ta = e.target as HTMLTextAreaElement;
      highlightRef.current.scrollTop = ta.scrollTop;
      highlightRef.current.scrollLeft = ta.scrollLeft;
    }
  });

  return {
    completions,
    activeIndex,
    isCompletionsLoading,
    cursorCoords,
    acceptCompletion,
    dismissCompletions,
    inputProps: {
      value: expression,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onSelect: handleSelect,
      onScroll: handleScroll,
    },
  };
}

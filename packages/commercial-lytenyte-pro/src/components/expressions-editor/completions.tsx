import { forwardRef, memo, useEffect, useRef, type CSSProperties, type JSX } from "react";
import { useExpressionRoot } from "./context.js";

function EditorCompletionsImpl(
  { style, ...props }: EditorCompletions.Props,
  forwarded: EditorCompletions.Props["ref"],
) {
  const { completions, activeIndex, isCompletionsLoading, acceptCompletion, cursorCoords } =
    useExpressionRoot();

  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector("[data-active]") as HTMLElement | null;
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!completions.length && !isCompletionsLoading) return null;

  const positionStyle: CSSProperties = cursorCoords
    ? { top: cursorCoords.top, left: cursorCoords.left, right: "auto" }
    : {};

  return (
    <ul
      ref={(el) => {
        listRef.current = el;
        if (typeof forwarded === "function") forwarded(el);
        else if (forwarded) forwarded.current = el;
      }}
      data-ln-expression-completions
      role="listbox"
      style={{ ...positionStyle, ...style }}
      {...props}
    >
      {completions.map((completion, i) => (
        <li
          key={completion.label}
          role="option"
          aria-selected={i === activeIndex}
          data-active={i === activeIndex || undefined}
          data-kind={completion.kind}
          // onMouseDown so the textarea doesn't lose focus before we accept
          onMouseDown={(e) => {
            e.preventDefault();
            acceptCompletion(i);
          }}
        >
          <span data-ln-completion-label>{completion.label}</span>
          {completion.kind && <span data-ln-completion-kind={completion.kind}>{completion.kind}</span>}
          {completion.detail && <span data-ln-completion-detail>{completion.detail}</span>}
        </li>
      ))}
      {isCompletionsLoading && (
        <li data-ln-completion-loading aria-disabled="true" role="option" aria-selected={false}>
          Loading…
        </li>
      )}
    </ul>
  );
}

export const EditorCompletions = memo(forwardRef(EditorCompletionsImpl));

export namespace EditorCompletions {
  export type Props = Omit<JSX.IntrinsicElements["ul"], "children">;
}

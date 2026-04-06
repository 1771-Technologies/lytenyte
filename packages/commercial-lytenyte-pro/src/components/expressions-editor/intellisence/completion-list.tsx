import { useRef, useEffect, type JSX, forwardRef, type ReactNode } from "react";
import { useCompletionListContext } from "./completion-context.js";
import type { CompletionItem } from "../types.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core/internal";

function CompletionListBase(
  {
    children,
    ...props
  }: Omit<JSX.IntrinsicElements["ul"], "children"> & {
    children?: (props: { readonly items: CompletionItem[]; readonly loading: boolean }) => ReactNode;
  },
  ref: JSX.IntrinsicElements["ul"]["ref"],
) {
  const { selectedIndex, items, loading } = useCompletionListContext();

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const selected = list.querySelector<HTMLElement>("[data-ln-selected]");
    selected?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const combined = useCombinedRefs(listRef, ref);

  return (
    <ul {...props} ref={combined} role="listbox" data-ln-expression-completion-list>
      {children?.({ items, loading })}
    </ul>
  );
}

export const CompletionList = forwardRef(CompletionListBase);

import { forwardRef, type JSX } from "react";
import { useCompletionListContext } from "./completion-context.js";
import type { CompletionItem } from "../types.js";

function CompleteListItemBase(
  {
    item,
    index,
    ...props
  }: JSX.IntrinsicElements["li"] & { readonly item: CompletionItem; readonly index: number },
  ref: JSX.IntrinsicElements["li"]["ref"],
) {
  const { selectedIndex, onSelect } = useCompletionListContext();

  return (
    <li
      {...props}
      ref={ref}
      role="option"
      aria-selected={index === selectedIndex}
      data-ln-selected={index === selectedIndex ? "" : undefined}
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect(item);
      }}
      data-ln-expression-completion-item
    />
  );
}

export const CompletionListItem = forwardRef(CompleteListItemBase);

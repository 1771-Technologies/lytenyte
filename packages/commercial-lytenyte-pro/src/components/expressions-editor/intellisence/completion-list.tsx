import { useRef, useEffect, type ReactNode } from "react";
import type { CompletionItem } from "../types.js";

interface CompletionListProps<T> {
  readonly items: CompletionItem<T>[];
  readonly selectedIndex: number;
  readonly renderItem: (item: CompletionItem<T>) => ReactNode;
  readonly onSelect: (item: CompletionItem<T>) => void;
}

export function CompletionList<T>({ items, selectedIndex, renderItem, onSelect }: CompletionListProps<T>) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const selected = list.querySelector<HTMLElement>("[data-selected]");
    selected?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <ul ref={listRef} role="listbox" data-ln-expression-completion-list>
      {items.map((item, index) => (
        <li
          key={item.id}
          role="option"
          aria-selected={index === selectedIndex}
          data-selected={index === selectedIndex ? "" : undefined}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(item);
          }}
          data-ln-expression-completion-item
        >
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

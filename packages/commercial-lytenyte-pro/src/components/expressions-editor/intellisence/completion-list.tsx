import type { ReactNode } from "react";
import type { CompletionItem } from "../types.js";

interface CompletionListProps<T> {
  readonly items: CompletionItem<T>[];
  readonly selectedIndex: number;
  readonly renderItem: (item: CompletionItem<T>) => ReactNode;
  readonly onSelect: (item: CompletionItem<T>) => void;
}

export function CompletionList<T>({ items, selectedIndex, renderItem, onSelect }: CompletionListProps<T>) {
  return (
    <ul role="listbox" data-ln-expression-editor-completion-list>
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
          data-ln-expression-editor-completion-item
        >
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

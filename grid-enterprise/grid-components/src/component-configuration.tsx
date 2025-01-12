import { cascada, signal, type Signal } from "@1771technologies/react-cascada";
import type { SortManagerConfiguration } from "./sort-manager/sort-manager";

export type ComponentConfiguration = {
  sortManager: Signal<SortManagerConfiguration>;
};

export const cc = cascada<ComponentConfiguration>(() => {
  return {
    sortManager: signal<SortManagerConfiguration>(
      {
        localization: {
          title: "Sort",
          labelSortByColumn: "Column",
          labelSortOn: "Sort on",
          labelOrder: "Order",
          labelApply: "OK",
          labelCancel: "Cancel",

          placeholderColumnSelect: "Sort by",
          placeholderSort: "Select...",
          placeholderOrder: "Select...",
        },
      },
      {
        bind: (v: SortManagerConfiguration) => {
          const current = cc.sortManager.peek() as SortManagerConfiguration;

          return { ...current, ...v } as SortManagerConfiguration;
        },
      },
    ),
  };
});

import { cascada, signal, type Signal } from "@1771technologies/react-cascada";
import type { SortManagerConfiguration } from "./sort-manager/sort-manager";
import type { TooltipProps } from "@1771technologies/react-tooltip";
import { clsx } from "@1771technologies/js-utils";
import { t } from "@1771technologies/grid-design";
import type { FloatingFrameConfiguration } from "./floating-frame/floating-frame-driver";
import { frameDefaultAxe } from "@1771technologies/react-frame";
import type { GridFrameConfiguration } from "./grid-frame/grid-frame";
import { splitPaneAxe } from "@1771technologies/react-split-pane";
import type { ColumnManagerConfiguration } from "./column-manager/column-manager";

export type ComponentConfiguration = {
  columnManager: Signal<ColumnManagerConfiguration>;
  gridFrame: Signal<GridFrameConfiguration>;
  floatingFrame: Signal<FloatingFrameConfiguration>;
  sortManager: Signal<SortManagerConfiguration>;
  tooltip: Signal<Omit<TooltipProps, "ref">>;
};

function mergeSignal<T>(c: T): Signal<T> {
  const x = signal(c, {
    bind: (v) => {
      const current = x.peek() as T;

      return { ...current, ...v } as T;
    },
  });
  return x;
}

export const cc = cascada<ComponentConfiguration>(() => {
  return {
    columnManager: mergeSignal<ColumnManagerConfiguration>({
      columnTree: {
        axe: {
          axeDescription:
            "The column tree display the available columns in the grid. " +
            "Use the up and down arrow keys to navigate up and down the tree. Use space to " +
            "toggle an expansion group. Use the left or right arrows to expand and collapse a group.",
          axeItemLabels: (item) => {
            return item.type === "leaf"
              ? (item.data.headerName ?? item.data.id)
              : (item.path.at(-1) ?? "");
          },
          axeLabel: (cnt) => `There are ${cnt} choices in the tree`,
        },
        checkboxLabel: "Toggle column visibility",
        dragLabel: "Move column",
        toggleLabel: "Toggle group visibility",
      },
    }),
    gridFrame: mergeSignal<GridFrameConfiguration>({
      axe: splitPaneAxe,
    }),
    floatingFrame: mergeSignal<FloatingFrameConfiguration>({
      axe: frameDefaultAxe,
      localization: {
        labelClose: "Close",
      },
    }),

    sortManager: mergeSignal<SortManagerConfiguration>({
      localization: {
        labelSortByColumn: "Column",
        labelSortOn: "Sort on",
        labelOrder: "Order",
        labelApply: "OK",
        labelCancel: "Cancel",
        labelAdd: "Add sort",
        labelDelete: "Delete sort",
        labelEmptyColumnSet: "There are no sortable columns.",

        placeholderColumnSelect: "Sort by",
        placeholderSort: "Select...",
        placeholderOrder: "Select...",

        disabledLastItem: "This sort can not be removed because it is the last item.",
        disabledNoMoreSortableColumns:
          "Another sort can not be added because there are no more sortable columns left.",
      },

      axe: {
        axeDescription:
          "Select an item. Use the up and down arrow keys to navigate to an item. " +
          "Press enter to accept the option. Escape to cancel.",
        axeItemLabels: (item) => (item.type === "leaf" ? item.data.label : ""),
        axeLabel: (cnt) => `There are ${cnt} items to choose from`,
      },
    }),

    tooltip: mergeSignal<Omit<TooltipProps, "ref">>({
      className: clsx(
        "lng1771-text-medium",
        css`
          background-color: ${t.colors.gray_90};
          color: ${t.colors.gray_00};
          border-radius: ${t.spacing.box_radius_regular};
          padding-inline: ${t.spacing.space_10};
          padding-block: ${t.spacing.space_05};
          max-width: 300px;

          box-shadow: 0px 6px 19px 0px rgba(30, 30, 41, 0.2);
        `,
      ),
      arrowColor: t.colors.gray_90,

      onInit: (el) => {
        el.style.transition = `opacity ${t.transitions.fast} ${t.transitions.fn}`;
        el.style.transitionDelay = "20ms";
        el.style.opacity = "0";
      },
      onOpen: (el) => {
        el.style.opacity = "1";
      },
      onClose: (el) => {
        el.style.opacity = "0";
      },
    }),
  };
});

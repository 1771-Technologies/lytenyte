import { cascada, signal, type Signal } from "@1771technologies/react-cascada";
import type { SortManagerConfiguration } from "./sort-manager/sort-manager";
import type { TooltipProps } from "@1771technologies/react-tooltip";
import { clsx } from "@1771technologies/js-utils";
import { t } from "@1771technologies/grid-design";
import type { FloatingFrameConfiguration } from "./floating-frame/floating-frame-driver";
import { frameDefaultAxe } from "@1771technologies/react-frame";

export type ComponentConfiguration = {
  floatingFrame: Signal<FloatingFrameConfiguration>;

  sortManager: Signal<SortManagerConfiguration>;
  tooltip: Signal<Omit<TooltipProps, "ref">>;
};

export const cc = cascada<ComponentConfiguration>(() => {
  return {
    floatingFrame: signal<FloatingFrameConfiguration>({
      axe: frameDefaultAxe,
    }),

    sortManager: signal<SortManagerConfiguration>(
      {
        localization: {
          labelSortByColumn: "Column",
          labelSortOn: "Sort on",
          labelOrder: "Order",
          labelApply: "OK",
          labelCancel: "Cancel",

          labelEmptyColumnSet: "There are no sortable columns.",

          placeholderColumnSelect: "Sort by",
          placeholderSort: "Select...",
          placeholderOrder: "Select...",

          disabledLastItem: "This sort can not be removed because it is the last item.",
          disabledNoMoreSortableColumns:
            "Another sort can not be added because there are no more sortable columns left.",
        },
      },
      {
        bind: (v: SortManagerConfiguration) => {
          const current = cc.sortManager.peek() as SortManagerConfiguration;

          return { ...current, ...v } as SortManagerConfiguration;
        },
      },
    ),

    tooltip: signal<Omit<TooltipProps, "ref">>({
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

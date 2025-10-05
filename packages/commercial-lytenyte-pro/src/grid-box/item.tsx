import { forwardRef, type CSSProperties, type JSX } from "react";
import { Item } from "../listbox/item.js";
import type { GridBoxItem } from "./+types";
import {
  useCombinedRefs,
  useSlot,
  type SlotComponent,
} from "@1771technologies/lytenyte-react-hooks";
import { useGridBoxContext } from "./context.js";
import { dragState, DropWrap, useDraggable } from "@1771technologies/lytenyte-core/yinternal";

export interface GridBoxItemProps {
  readonly item: GridBoxItem;
  readonly itemAs?: SlotComponent;
  readonly itemClassName?: string;
  readonly itemStyle?: CSSProperties;
}

export const BoxItem = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & GridBoxItemProps>(
  function BoxItem({ item, itemAs, itemClassName, itemStyle, children, ...props }, forwarded) {
    const { accepted } = useGridBoxContext();

    const { dragProps } = useDraggable({
      getItems: () => {
        return {
          siteLocalData: item.dragData,
        };
      },
      placeholder: item.dragPlaceholder ? (_, el) => item.dragPlaceholder!(el) : undefined,
    });

    const ref = useCombinedRefs(forwarded, dragProps.ref);

    const extraProps = item.draggable ? { ...dragProps, ref } : { ref: forwarded };

    const renderer = useSlot({
      props: [
        {
          children: (
            <Item
              {...extraProps}
              onKeyDown={(ev) => {
                if (ev.key === " ") {
                  item.onAction?.(ev.currentTarget);
                  ev.preventDefault();
                }
                if (ev.key === "Backspace" || ev.key === "Delete")
                  item.onDelete?.(ev.currentTarget);
              }}
              onClick={(ev) => item.onAction(ev.currentTarget)}
              className={itemClassName}
              style={itemStyle}
              data-ln-source={item.source}
              data-ln-index={item.index}
            >
              {children}
            </Item>
          ),
        },
      ],
      slot: itemAs ?? <div />,
    });

    return (
      <DropWrap
        {...props}
        active={item.active}
        onEnter={(e) => {
          const data = dragState.active.get();

          const thisSource = e.getAttribute("data-ln-source");
          const dragSource = data?.getAttribute("data-ln-source");

          if (!data) return;
          if (thisSource !== dragSource) {
            e.setAttribute("data-ln-is-after", "true");
            return;
          }

          const overIndex = Number.parseInt(e.getAttribute("data-ln-index")!);
          const dragIndex = Number.parseInt(data.getAttribute("data-ln-index")!);

          if (Number.isNaN(dragIndex) || Number.isNaN(overIndex) || overIndex === dragIndex) return;

          if (overIndex < dragIndex) {
            e.setAttribute("data-ln-is-before", "true");
          } else {
            e.setAttribute("data-ln-is-after", "true");
          }
        }}
        onLeave={(el) => {
          el.removeAttribute("data-ln-is-before");
          el.removeAttribute("data-ln-is-after");
        }}
        data-ln-source={item.source}
        data-ln-index={item.index}
        accepted={item.active === false ? [] : accepted}
        onDrop={(e) => {
          const el = e.dropElement;

          el.removeAttribute("data-ln-is-before");
          el.removeAttribute("data-ln-is-after");
          item.onDrop(e);
        }}
        as={renderer}
      />
    );
  },
);

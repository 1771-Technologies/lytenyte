import { forwardRef, type JSX } from "react";
import { Item } from "../listbox/item";
import type { GridBoxItem } from "./+types";
import { DropWrap, useDraggable } from "@1771technologies/lytenyte-dragon";
import {
  useCombinedRefs,
  useSlot,
  type SlotComponent,
} from "@1771technologies/lytenyte-react-hooks";
import { useGridBoxContext } from "./context";

export interface GridBoxItemProps {
  readonly item: GridBoxItem;
  readonly itemWrap?: SlotComponent;
}

export const BoxItem = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & GridBoxItemProps>(
  function BoxItem({ item, itemWrap, ...props }, forwarded) {
    const { accepted } = useGridBoxContext();

    const { dragProps } = useDraggable({
      getItems: () => {
        return {
          siteLocalData: item.dragData,
        };
      },
      placeholder: item.dragPlaceholder,
    });

    const ref = useCombinedRefs(forwarded, dragProps.ref);

    const extraProps = item.draggable ? { ...dragProps, ref } : { ref: forwarded };

    const renderer = useSlot({
      props: [
        {
          children: (
            <Item
              {...props}
              {...extraProps}
              onKeyDown={(ev) => {
                if (ev.key === " ") item.onAction?.();
                if (ev.key === "Backspace" || ev.key === "Delete") item.onDelete?.();
              }}
              onClick={() => item.onAction()}
            />
          ),
        },
      ],
      slot: itemWrap ?? <div />,
    });

    return <DropWrap accepted={accepted} onDrop={item.onDrop} as={renderer} />;
  },
);

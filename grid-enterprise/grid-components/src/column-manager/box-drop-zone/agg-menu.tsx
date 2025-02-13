import { IconButton } from "../../buttons/icon-button";
import { t } from "@1771technologies/grid-design";
import { useGrid } from "../../provider/grid-provider";
import { PopoverMenu } from "../../popover-menu/popover-menu";
import { useMemo, useRef } from "react";
import type { MenuItem, MenuItemCheckbox } from "@1771technologies/react-menu-legacy";

export function AggMenu({
  allowed,
  current,
  onSelect,
  onRemove,
  onOpenChange,
  open,
  label,
}: {
  allowed: string[];
  current: string;
  onRemove: () => void;
  onSelect: (s: string) => void;
  onOpenChange: (b: boolean) => void;
  open: boolean;
  label: string;
}) {
  const { state } = useGrid();
  const ref = useRef<HTMLSpanElement | null>(null);

  const menuItems = useMemo(() => {
    const items: MenuItem[] = allowed.map((c) => {
      return {
        checked: c === current,
        id: c,
        kind: "checkbox",
        label: c,
        onCheckChange: () => {
          onSelect(c);
          onOpenChange(false);
        },
      } satisfies MenuItemCheckbox;
    });

    items.push({ kind: "separator" });
    items.push({ kind: "item", action: onRemove, id: "lng-delete", label: "Remove" });

    return items;
  }, [allowed, current, onOpenChange, onRemove, onSelect]);

  if (allowed.length === 0) return null;

  return (
    <>
      <IconButton
        tabIndex={-1}
        kind="ghost"
        onClick={() => onOpenChange(true)}
        aria-label={label}
        className={css`
          &:focus {
            outline: none;
            border: transparent;
          }
        `}
      >
        <span
          ref={ref}
          className={css`
            display: grid;
            width: 20px;
            height: 20px;
            grid-template-rows: 4px 4px 4px;
            grid-template-columns: 4px;
            gap: 1px;
            place-items: center;
            justify-content: center;
            align-content: center;

            & > span {
              border-radius: 9999px;
              background-color: ${t.colors.borders_icons_default};
              height: 100%;
              width: 100%;
              display: block;
            }
          `}
        >
          <span></span>
          <span></span>
          <span></span>
        </span>
      </IconButton>
      {ref.current && (
        <PopoverMenu
          open={open}
          onOpenChange={onOpenChange}
          placement="bottom"
          popoverTarget={ref.current!}
          menuItems={menuItems}
          rtl={state.rtl.peek()}
        />
      )}
    </>
  );
}

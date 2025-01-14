import { IconButton } from "../../buttons/icon-button";
import { t } from "@1771technologies/grid-design";
import { useGrid } from "../../provider/grid-provider";
import { PopoverMenu } from "../../popover-menu/popover-menu";
import { useRef, useState } from "react";
import type { MenuItemCheckbox } from "@1771technologies/react-menu";

export function AggMenu({
  allowed,
  current,
  onSelect,
}: {
  allowed: string[];
  current: string;
  onSelect: (s: string) => void;
}) {
  const { state } = useGrid();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  if (allowed.length === 0) return null;

  return (
    <>
      <IconButton
        tabIndex={-1}
        kind="ghost"
        onClick={() => setOpen(true)}
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
          onOpenChange={setOpen}
          placement="bottom"
          popoverTarget={ref.current!}
          menuItems={allowed.map((c) => {
            return {
              checked: c === current,
              id: c,
              kind: "checkbox",
              label: c,
              onCheckChange: () => {
                onSelect(c);
                setOpen(false);
              },
            } satisfies MenuItemCheckbox;
          })}
          rtl={state.rtl.peek()}
        />
      )}
    </>
  );
}

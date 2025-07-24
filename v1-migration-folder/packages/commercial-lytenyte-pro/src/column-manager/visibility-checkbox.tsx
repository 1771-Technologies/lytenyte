import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useColumnItemContext } from "./context";
import { forwardRef, useCallback, useMemo, type JSX } from "react";
import { useGrid } from "../grid-provider/use-grid";
import { useColumnsFromContext } from "./use-columns-from-context";

interface VisibilityCheckbox {
  readonly slot?: SlotComponent<{
    visible: boolean;
    indeterminate: boolean;
    toggle: (s?: boolean) => void;
  }>;
}

export const VisibilityCheckbox = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & VisibilityCheckbox
>(function VisibilityCheckbox({ slot, ...props }, forwarded) {
  const { item } = useColumnItemContext();

  const grid = useGrid();

  const base = grid.state.columnBase.useValue();

  const columns = useColumnsFromContext(item);

  const [isVisible, isIndeterminate] = useMemo(() => {
    const allVisible = columns.every((c) => !(c.hide ?? base.hide));
    const someVisible = columns.some((c) => !(c.hide ?? base.hide));

    return [allVisible, !allVisible && someVisible];
  }, [base.hide, columns]);

  const toggle = useCallback(
    (s?: boolean) => {
      const next = s ?? isVisible;
      grid.api.columnUpdate(Object.fromEntries(columns.map((c) => [c.id, { hide: next }])));
    },
    [columns, grid.api, isVisible],
  );

  const rendered = useSlot({
    props: [props],
    ref: forwarded,
    slot: slot ?? (
      <input
        type="checkbox"
        checked={isVisible}
        onChange={() => {
          toggle();
        }}
      />
    ),
    state: { visible: isVisible, indeterminate: isIndeterminate, toggle },
  });

  return rendered;
});

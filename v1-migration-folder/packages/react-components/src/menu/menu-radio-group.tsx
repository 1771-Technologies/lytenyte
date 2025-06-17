import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, useMemo, type JSX } from "react";
import {
  MenuRadioGroupProvider,
  type MenuRadioGroupContext,
} from "./contexts/context-radio-group.js";

export interface MenuRadioGroupProps {
  readonly value: any;
  readonly onChange: (v: any) => void;

  readonly as?: SlotComponent;
}

export const MenuRadioGroup = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "onChange"> & MenuRadioGroupProps
>(function MenuRadioGroup({ as, value, onChange, ...props }, forwarded) {
  const contextValue = useMemo<MenuRadioGroupContext>(() => {
    return {
      value,
      onChange: onChange,
    } satisfies MenuRadioGroupContext;
  }, [onChange, value]);

  const internalProps: JSX.IntrinsicElements["div"] = {};
  const slot = useSlot({
    props: [internalProps, props, { role: "group" }],
    ref: forwarded,
    slot: as ?? <div />,
  });

  return <MenuRadioGroupProvider value={contextValue}>{slot}</MenuRadioGroupProvider>;
});

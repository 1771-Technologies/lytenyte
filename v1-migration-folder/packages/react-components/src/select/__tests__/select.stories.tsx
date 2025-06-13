import type { Meta, StoryObj } from "@storybook/react";
import { SelectRoot } from "../select-root.js";
import { SelectLabel } from "../select-label.js";
import { useSelect } from "../use-select.js";
import { SelectInput } from "../select-input.js";
import { SelectOptions } from "../select-options.js";
import { SelectOption } from "../select-item.js";
import { SelectPositioner } from "../select-positioner.js";
import { SelectPortal } from "../select-portal.js";
import { SelectToggle } from "../select-toggle.js";
import { SelectClear } from "../select-clear.js";

const meta: Meta = {
  title: "Components/Select",
};

export default meta;

const items = ["Apple", "Banana", "Blueberry", "Cherry", "Grape", "Pineapple", "Strawberry"].map(
  (c) => ({ id: c, label: c }),
);

function MainComp() {
  const { context, state } = useSelect({ items });

  return (
    <SelectRoot context={context}>
      <SelectLabel>Fruit</SelectLabel>
      <SelectInput></SelectInput>
      <SelectToggle>O</SelectToggle>
      <SelectClear>X</SelectClear>
      <SelectPortal>
        <SelectPositioner>
          <SelectOptions>
            {state.options.map((c, i) => {
              return (
                <SelectOption key={c} option={c} index={i}>
                  {state.lookup.get(c)!.label}
                </SelectOption>
              );
            })}
          </SelectOptions>
        </SelectPositioner>
      </SelectPortal>
    </SelectRoot>
  );
}

export const Main: StoryObj = {
  render: () => {
    return <MainComp />;
  },
};

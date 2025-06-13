import type { Meta, StoryObj } from "@storybook/react";
import { SelectRoot } from "../select-root";
import { SelectLabel } from "../select-label";
import { useSelect } from "../use-select";
import { SelectInput } from "../select-input";
import { SelectOptions } from "../select-options";
import { SelectOption } from "../select-item";
import { SelectPositioner } from "../select-positioner";
import { SelectPortal } from "../select-portal";
import { SelectToggle } from "../select-toggle";
import { SelectClear } from "../select-clear";

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

import { useMultiSelect } from "../use-multi-select.js";
import "./multi-select.css";

import type { Meta, StoryObj } from "@storybook/react";
import { states } from "./data.js";
import { MultiSelectRoot } from "../multi-select-root.js";
import { MultiSelectLabel } from "../multi-select-label.js";
import { MultiSelectPanel } from "../multi-select-panel.js";
import { MultiSelectTag } from "../multi-select-tag.js";
import { MultiSelectInput } from "../multi-select-input.js";
import { MultiSelectClear } from "../multi-select-clear.js";
import { MultiSelectToggle } from "../multi-select-toggle.js";
import { MultiSelectPortal } from "../multi-select-portal.js";
import { MultiSelectPositioner } from "../multi-select-positioner.js";
import { MultiSelectOption } from "../multi-select-option.js";
import { MultiSelectOptions } from "../multi-select-options.js";
import { useState } from "react";
import { within } from "@testing-library/react";
import { expect, userEvent } from "@storybook/test";
import { sleep } from "@1771technologies/lytenyte-js-utils";
import { useMultiSelectDrop } from "../use-multi-select-drop.js";

const meta: Meta = {
  title: "Components/MultiSelect",
};

export default meta;

const MainComp = () => {
  const { context, state } = useMultiSelect({
    items: states,
    closeOnSelect: false,
    allowDeselect: true,
  });

  return (
    <MultiSelectRoot context={context}>
      <MultiSelectLabel>States</MultiSelectLabel>
      <MultiSelectPanel>
        {state.selected.map((c) => {
          return (
            <MultiSelectTag tag={c.id} key={c.id} onClick={() => state.remove(c.id)}>
              {c.label} {state.isTagActive(c.id) ? "A" : "X"}
            </MultiSelectTag>
          );
        })}
        <MultiSelectInput />
        {!state.isInputEmpty && <MultiSelectClear>X</MultiSelectClear>}
        <MultiSelectToggle>O</MultiSelectToggle>
      </MultiSelectPanel>

      <MultiSelectPortal>
        <MultiSelectPositioner>
          <MultiSelectOptions>
            {state.options.map((c, i) => {
              return (
                <MultiSelectOption key={c} option={c} index={i}>
                  {c}
                </MultiSelectOption>
              );
            })}
          </MultiSelectOptions>
        </MultiSelectPositioner>
      </MultiSelectPortal>
    </MultiSelectRoot>
  );
};

export const Main: StoryObj = {
  render: MainComp,
  play: async () => {
    const c = within(document.body);

    const input = c.getByLabelText("States");
    input.focus();
    await expect(input).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(c.getByText("Alaska")).toBeVisible();
    await userEvent.click(c.getByText("Oregon"));

    await userEvent.keyboard("{ArrowLeft}");
    await sleep();
    await userEvent.keyboard("{Enter}{Escape}");
  },
};

const ControlledComp = () => {
  const [selected, setSelected] = useState([states[0], states[1]]);
  const { context, state } = useMultiSelect({
    items: states,
    closeOnSelect: false,
    allowDeselect: true,
    selected,
    onSelect: setSelected,
  });

  return (
    <MultiSelectRoot context={context}>
      <MultiSelectLabel>States</MultiSelectLabel>
      <MultiSelectPanel>
        {state.selected.map((c) => {
          return (
            <MultiSelectTag
              tag={c.id}
              key={c.id}
              onClick={() => state.remove(c.id)}
              removable={false}
            >
              {c.label} {state.isTagActive(c.id) ? "A" : "X"}
            </MultiSelectTag>
          );
        })}
        <MultiSelectInput />
        {!state.isInputEmpty && <MultiSelectClear>X</MultiSelectClear>}
        <MultiSelectToggle>O</MultiSelectToggle>
      </MultiSelectPanel>

      <MultiSelectPortal>
        <MultiSelectPositioner>
          <MultiSelectOptions>
            {state.options.map((c, i) => {
              return (
                <MultiSelectOption key={c} option={c} index={i}>
                  {c}
                </MultiSelectOption>
              );
            })}
          </MultiSelectOptions>
        </MultiSelectPositioner>
      </MultiSelectPortal>
    </MultiSelectRoot>
  );
};

export const Controlled: StoryObj = {
  render: ControlledComp,

  play: async () => {
    const c = within(document.body);

    const input = c.getByLabelText("States");
    input.focus();
    await expect(input).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(c.getByText("Alaska")).toBeVisible();

    await userEvent.keyboard("Ore");
    await userEvent.click(c.getByText("X"));

    await userEvent.click(c.getByText("Oregon"));

    await userEvent.keyboard("{ArrowLeft}");
    await sleep();
    await userEvent.keyboard("{Enter}{Escape}");
  },
};

const MultiSelectDropCompControlled = () => {
  const [selected, setSelected] = useState([states[0], states[1]]);
  const { context, state } = useMultiSelectDrop({
    items: states,
    closeOnSelect: false,
    allowDeselect: true,
    selected,
    onSelect: setSelected,
  });

  return (
    <MultiSelectRoot context={context}>
      <MultiSelectToggle>O</MultiSelectToggle>

      <MultiSelectLabel>For coverage</MultiSelectLabel>
      <MultiSelectPortal>
        <MultiSelectPositioner>
          <div>
            <MultiSelectPanel>
              {state.selected.map((c) => {
                return (
                  <MultiSelectTag
                    tag={c.id}
                    key={c.id}
                    onClick={() => state.remove(c.id)}
                    removable={false}
                  >
                    {c.label} {state.isTagActive(c.id) ? "A" : "X"}
                  </MultiSelectTag>
                );
              })}

              <MultiSelectInput />
              {!state.isInputEmpty && <MultiSelectClear>X</MultiSelectClear>}
            </MultiSelectPanel>

            <MultiSelectOptions>
              {state.options.map((c, i) => {
                return (
                  <MultiSelectOption key={c} option={c} index={i}>
                    {c}
                  </MultiSelectOption>
                );
              })}
            </MultiSelectOptions>
          </div>
        </MultiSelectPositioner>
      </MultiSelectPortal>
    </MultiSelectRoot>
  );
};

export const MultiSelectDropControlled: StoryObj = {
  render: MultiSelectDropCompControlled,

  play: async () => {
    const c = within(document.body);
    await userEvent.click(c.getByText("O"));

    await userEvent.click(c.getByText("Alaska X"));

    await userEvent.click(c.getByText("Missouri"));

    await userEvent.keyboard("{Escape}");
    await sleep();

    await expect(c.getByText("O")).toHaveFocus();
  },
};

const MultiSelectDropComp = () => {
  const { context, state } = useMultiSelectDrop({
    items: states,
    allowDeselect: true,
  });

  return (
    <MultiSelectRoot context={context}>
      <MultiSelectToggle>O</MultiSelectToggle>

      <MultiSelectLabel>For coverage</MultiSelectLabel>
      <MultiSelectPortal>
        <MultiSelectPositioner>
          <div>
            <MultiSelectPanel>
              {state.selected.map((c) => {
                return (
                  <MultiSelectTag
                    tag={c.id}
                    key={c.id}
                    onClick={() => state.remove(c.id)}
                    removable={false}
                  >
                    {c.label} {state.isTagActive(c.id) ? "A" : "X"}
                  </MultiSelectTag>
                );
              })}

              <MultiSelectInput />
              {!state.isInputEmpty && <MultiSelectClear>X</MultiSelectClear>}
            </MultiSelectPanel>

            <MultiSelectOptions>
              {state.options.map((c, i) => {
                return (
                  <MultiSelectOption key={c} option={c} index={i}>
                    {c}
                  </MultiSelectOption>
                );
              })}
            </MultiSelectOptions>
          </div>
        </MultiSelectPositioner>
      </MultiSelectPortal>
    </MultiSelectRoot>
  );
};

export const MultiSelectDrop: StoryObj = {
  render: MultiSelectDropComp,

  play: async () => {
    const c = within(document.body);
    await userEvent.click(c.getByText("O"));

    await userEvent.keyboard("missouri");
    await userEvent.click(c.getByText("Missouri"));

    await sleep();

    await expect(c.getByText("O")).toHaveFocus();
  },
};

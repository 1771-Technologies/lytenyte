import "./autocomplete.css";
import type { Meta, StoryObj } from "@storybook/react";
import { states } from "./data.js";

import { AutocompleteRoot } from "../autocomplete-root.js";
import { useAutocomplete } from "../use-autocomplete.js";
import { AutocompleteLabel } from "../autocomplete-label.js";
import { AutocompleteInput } from "../autocomplete-input.js";
import { AutocompleteClear } from "../autocomplete-clear.js";
import { AutocompletePortal } from "../autocomplete-portal.js";
import { AutocompletePositioner } from "../autocomplete-positioner.js";
import { AutocompleteOptions } from "../autocomplete-options.js";
import { AutocompleteOption } from "../autocomplete-option.js";
import { AutocompleteToggle } from "../autocomplete-toggle.js";
import { expect, userEvent, within } from "@storybook/test";
import { sleep } from "@1771technologies/lytenyte-js-utils";
import { useState } from "react";

const meta: Meta = {
  title: "Components/Autocomplete",
};

export default meta;

function MainComp() {
  const { context, state } = useAutocomplete({
    items: states,
  });
  return (
    <AutocompleteRoot context={context}>
      <AutocompleteLabel>Fruit</AutocompleteLabel>
      <AutocompleteInput></AutocompleteInput>
      <AutocompleteToggle>O</AutocompleteToggle>
      <AutocompleteClear>X</AutocompleteClear>
      <AutocompletePortal>
        <AutocompletePositioner>
          <AutocompleteOptions>
            {state.options.map((c, i) => {
              return (
                <AutocompleteOption key={c} option={c} index={i}>
                  {state.lookup.get(c)!.label}
                </AutocompleteOption>
              );
            })}
          </AutocompleteOptions>
        </AutocompletePositioner>
      </AutocompletePortal>
    </AutocompleteRoot>
  );
}
export const Main: StoryObj = {
  render: MainComp,
  play: async () => {
    const c = within(document.body);

    const input = c.getByLabelText("Fruit");

    input.focus();
    await sleep();

    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{Enter}");
    await expect(input).toHaveValue("Alaska");
  },
};

function WithCompletion() {
  const [selected, setSelected] = useState(states[0]);
  const { context, state } = useAutocomplete({
    items: states,
    selected,
    onSelect: (i) => {
      if (i) setSelected(i);
    },
    onComplete: (q, res) => {
      const index = state.options.findIndex((c) => state.lookup.get(c)?.label.startsWith(q));
      if (index !== -1) res({ index: index, item: state.options[index] });
    },
  });
  return (
    <AutocompleteRoot context={context}>
      <AutocompleteLabel>Fruit</AutocompleteLabel>
      <AutocompleteInput></AutocompleteInput>
      <AutocompleteToggle>O</AutocompleteToggle>
      <AutocompleteClear>X</AutocompleteClear>
      <AutocompletePortal>
        <AutocompletePositioner>
          <AutocompleteOptions>
            {state.options.map((c, i) => {
              return (
                <AutocompleteOption key={c} option={c} index={i}>
                  {state.lookup.get(c)!.label}
                </AutocompleteOption>
              );
            })}
          </AutocompleteOptions>
        </AutocompletePositioner>
      </AutocompletePortal>
    </AutocompleteRoot>
  );
}
export const Completion: StoryObj = {
  render: WithCompletion,
  play: async () => {
    const c = within(document.body);

    const input = c.getByLabelText("Fruit");

    input.focus();
    userEvent.clear(input);
    await sleep();

    await userEvent.keyboard("Ida");
    await expect(input).toHaveValue("Idaho");
    await userEvent.keyboard("{Enter}");
    await expect(input).toHaveValue("Idaho");
  },
};

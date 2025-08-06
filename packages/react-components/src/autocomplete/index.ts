import type {
  SelectClearProps,
  SelectOptionProps,
  SelectOptionsProps,
  SelectPortalProps,
  SelectPositionerProps,
  SelectRootProps,
  SelectToggleProps,
} from "../select/index.js";
import { AutocompleteClear } from "./autocomplete-clear.js";
import { AutocompleteInput } from "./autocomplete-input.js";
import { AutocompleteOption } from "./autocomplete-option.js";
import { AutocompleteOptions } from "./autocomplete-options.js";
import { AutocompletePortal } from "./autocomplete-portal.js";
import { AutocompletePositioner } from "./autocomplete-positioner.js";
import { AutocompleteRoot } from "./autocomplete-root.js";
import { AutocompleteToggle } from "./autocomplete-toggle.js";
import { useAutocomplete } from "./use-autocomplete.js";

export const Autocomplete = {
  Root: AutocompleteRoot,
  Clear: AutocompleteClear,
  Toggle: AutocompleteToggle,
  Input: AutocompleteInput,
  Option: AutocompleteOption,
  Options: AutocompleteOptions,
  Portal: AutocompletePortal,
  Position: AutocompletePositioner,

  useAutocomplete,
};

export type AutocompleteRootProps = SelectRootProps;
export type AutocompleteClearProps = SelectClearProps;
export type AutocompleteToggleProps = SelectToggleProps;
export type AutocompleteOptionsProps = SelectOptionsProps;
export type AutocompleteOptionProps = SelectOptionProps;
export type AutocompletePositionProps = SelectPositionerProps;
export type AutocompletePortalProps = SelectPortalProps;
export type { AutocompleteItem, UseAutocompleteArgs } from "./use-autocomplete.js";

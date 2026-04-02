import type { KeyboardEvent } from "react";
import type { CompletionItem, KeybindingConfig, WordAtCursor } from "./types.js";
import { handleCompletionKeyDown } from "./handle-completion-key-down.js";
import { handleEnterKey } from "./handle-enter-key.js";
import { isManualTrigger } from "./handle-manual-trigger.js";

interface KeyDownDeps<T> {
  readonly isPopoverOpen: boolean;
  readonly multiline: boolean;
  readonly keybindings?: KeybindingConfig;
  readonly selectedItem: CompletionItem<T> | null;
  readonly wordAtCursor: WordAtCursor | null;
  readonly onAcceptCompletion: (item: CompletionItem<T>, word: WordAtCursor) => void;
  readonly onNavigate: (direction: "up" | "down") => void;
  readonly onDismiss: () => void;
  readonly onCancelTrigger: () => void;
  readonly onManualTrigger: () => void;
  readonly onValueChange: (value: string) => void;
  readonly onExternalKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function createKeyDownHandler<T>(deps: KeyDownDeps<T>) {
  return (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (deps.onExternalKeyDown) {
      deps.onExternalKeyDown(e);
      if (e.defaultPrevented) return;
    }

    if (deps.isPopoverOpen) {
      const action = handleCompletionKeyDown(e.key, deps.keybindings);

      if (action.type === "navigate") {
        e.preventDefault();
        deps.onNavigate(action.direction);
        return;
      }

      if (action.type === "accept" && deps.selectedItem && deps.wordAtCursor) {
        e.preventDefault();
        deps.onAcceptCompletion(deps.selectedItem, deps.wordAtCursor);
        return;
      }

      if (action.type === "dismiss") {
        e.preventDefault();
        deps.onDismiss();
        deps.onCancelTrigger();
        return;
      }
    }

    if (isManualTrigger(e)) {
      e.preventDefault();
      deps.onManualTrigger();
      return;
    }

    if (e.key === "Enter") {
      const { value, selectionStart, selectionEnd } = e.currentTarget;
      const result = handleEnterKey(value, selectionStart, selectionEnd, deps.multiline);

      if (result === null) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      e.currentTarget.value = result.value;
      e.currentTarget.selectionStart = result.cursorPosition;
      e.currentTarget.selectionEnd = result.cursorPosition;
      deps.onValueChange(result.value);
    }
  };
}

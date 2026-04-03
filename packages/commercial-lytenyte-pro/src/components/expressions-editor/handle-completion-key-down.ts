import type { CompletionAction, KeybindingConfig } from "./types.js";

const DEFAULT_KEYBINDINGS: Required<KeybindingConfig> = {
  accept: ["Enter", "Tab"],
  dismiss: ["Escape"],
  navigateUp: ["ArrowUp"],
  navigateDown: ["ArrowDown"],
};

export function handleCompletionKeyDown(key: string, keybindings?: KeybindingConfig): CompletionAction {
  const bindings = { ...DEFAULT_KEYBINDINGS, ...keybindings };

  if (bindings.navigateUp.includes(key)) {
    return { type: "navigate", direction: "up" };
  }

  if (bindings.navigateDown.includes(key)) {
    return { type: "navigate", direction: "down" };
  }

  if (bindings.accept.includes(key)) {
    return { type: "accept" };
  }

  if (bindings.dismiss.includes(key)) {
    return { type: "dismiss" };
  }

  return { type: "none" };
}

import { useCallback } from "react";
import type { CompletionItem, WordAtCursor } from "./types";
import { replaceWordAtCursor } from "./replace-word-at-cursor.js";

interface NavigationDeps {
  readonly onValueChange: (value: string) => void;
  readonly onDismiss: () => void;
  readonly textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function useKeyboardNavigation({ onValueChange, onDismiss, textareaRef }: NavigationDeps) {
  const acceptCompletion = useCallback(
    (item: CompletionItem, word: WordAtCursor) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { value, cursorPosition } = replaceWordAtCursor(textarea.value, word, item.label);

      textarea.value = value;
      textarea.selectionStart = cursorPosition;
      textarea.selectionEnd = cursorPosition;

      onValueChange(value);
      onDismiss();
    },
    [onValueChange, onDismiss, textareaRef],
  );

  return { acceptCompletion };
}

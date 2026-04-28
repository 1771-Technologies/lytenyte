import { useCallback } from "react";
import type { CompletionItem, WordAtCursor } from "./types";
import { replaceWordAtCursor } from "./replace-word-at-cursor.js";

interface NavigationDeps {
  readonly onValueChange: (value: string) => void;
  readonly onAccepted: (value: string, cursorPosition: number) => void;
  readonly textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function useKeyboardNavigation({ onValueChange, onAccepted, textareaRef }: NavigationDeps) {
  const acceptCompletion = useCallback(
    (item: CompletionItem, word: WordAtCursor) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Extend the replacement range to consume any @"..." / @'...' prefix the user already typed.
      // The partial word may contain spaces (e.g. @"Age Gr → word is "Gr"), so scan backwards
      // through word chars and spaces to find the opening @" / @'.
      let adjustedWord = word;
      const text = textarea.value;
      let scan = word.start - 1;
      // skip back over any chars that could be part of a quoted identifier value (spaces included)
      while (scan > 0 && text[scan] !== '"' && text[scan] !== "'") scan--;
      if (scan >= 1 && (text[scan] === '"' || text[scan] === "'") && text[scan - 1] === "@") {
        adjustedWord = { ...word, start: scan - 1 };
      }

      const charBeforeWord = adjustedWord.start > 0 ? text[adjustedWord.start - 1] : "";
      const noSpaceBefore =
        charBeforeWord === "" ||
        charBeforeWord === " " ||
        charBeforeWord === "." ||
        charBeforeWord === "(" ||
        charBeforeWord === "[" ||
        charBeforeWord === "{";
      const rawInsertText = item.value ?? item.label;
      const insertText = noSpaceBefore ? rawInsertText : " " + rawInsertText;
      const { value, cursorPosition } = replaceWordAtCursor(text, adjustedWord, insertText);

      textarea.value = value;
      textarea.selectionStart = cursorPosition;
      textarea.selectionEnd = cursorPosition;

      onValueChange(value);
      onAccepted(value, cursorPosition);
    },
    [onValueChange, onAccepted, textareaRef],
  );

  return { acceptCompletion };
}

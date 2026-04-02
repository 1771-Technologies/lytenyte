import { useCallback, useRef, useEffect } from "react";
import type { Token, WordAtCursor } from "./types";
import { getWordAtCursor } from "./get-word-at-cursor.js";

const DEBOUNCE_DELAY = 150;

type TriggerConfig = {
  triggerCharacters: string[];
  onTrigger: (tokens: Token[], cursorPosition: number, word: WordAtCursor) => void;
  tokenize: (value: string) => Token[];
};

export function useCompletionTrigger(config: TriggerConfig) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const configRef = useRef(config);
  configRef.current = config;

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => cancel, [cancel]);

  const triggerManually = useCallback(
    (value: string, cursorPosition: number) => {
      cancel();
      const { tokenize, onTrigger } = configRef.current;
      const tokens = tokenize(value);
      const word = getWordAtCursor(value, cursorPosition);
      onTrigger(tokens, cursorPosition, word);
    },
    [cancel],
  );

  const handleInputChange = useCallback(
    (value: string, cursorPosition: number) => {
      cancel();

      const { triggerCharacters, tokenize, onTrigger } = configRef.current;
      const charBeforeCursor = value[cursorPosition - 1] || "";

      if (triggerCharacters.includes(charBeforeCursor)) {
        const tokens = tokenize(value);
        const word = getWordAtCursor(value, cursorPosition);
        onTrigger(tokens, cursorPosition, word);
        return;
      }

      const word = getWordAtCursor(value, cursorPosition);
      if (word.word.length > 0) {
        timerRef.current = setTimeout(() => {
          const tokens = configRef.current.tokenize(value);
          configRef.current.onTrigger(tokens, cursorPosition, word);
        }, DEBOUNCE_DELAY);
      }
    },
    [cancel],
  );

  return { handleInputChange, triggerManually, cancel };
}

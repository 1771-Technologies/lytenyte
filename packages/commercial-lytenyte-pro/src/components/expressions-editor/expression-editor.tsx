import { useRef, useCallback, useMemo, Fragment } from "react";
import type { ExpressionEditorProps, CompletionItem } from "./types";
import { useCompletions } from "./intellisence/use-completions.js";
import { useCompletionTrigger } from "./intellisence/use-complete-trigger.js";
import { useKeyboardNavigation } from "./use-keyboard-navigation.js";
import { useCursorPosition } from "./cursor-position/use-cursor-position.js";
import { createKeyDownHandler } from "./create-key-down-handler.js";
import { getWordAtCursor } from "./intellisence/get-word-at-cursor.js";
import type { CSSProperties } from "react";
import { CompletionPopover } from "./intellisence/completion-popover.js";
import { CompletionList } from "./intellisence/completion-list.js";
import { DefaultTokenHighlighter } from "./token-highlighter-default.js";

const sharedFontStyle: CSSProperties = {
  fontFamily: "inherit",
  fontSize: "inherit",
  fontWeight: "inherit",
  fontStyle: "inherit",
  letterSpacing: "inherit",
  lineHeight: "inherit",
  padding: "0",
};

export function ExpressionEditor<T>({
  value,
  onValueChange,
  tokenize,
  highlight: Highlighter = DefaultTokenHighlighter,
  completionProvider,
  renderCompletionItem,
  triggerCharacters = ["."],
  placeholder,
  disabled,
  readOnly,
  className,
  completionClassName,
  renderLoading,
  style,
  keybindings,
  onKeyDown: onExternalKeyDown,
  onBlur,
  onFocus,
}: ExpressionEditorProps<T>) {
  // TODO @Lee: we should eventually allow multiline expressions but for now there isn't really a valid
  // use case that requires multiline expressions without also allow variable support.
  const multiline = false;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const depsRef = useRef<{
    isOpen: boolean;
    selectedItem: CompletionItem<T> | null;
    navigate: (direction: "up" | "down") => void;
    dismiss: () => void;
    acceptCompletion: (item: CompletionItem<T>, word: ReturnType<typeof getWordAtCursor>) => void;
    triggerManually: (value: string, cursorPosition: number) => void;
    onValueChange: (value: string) => void;
    onExternalKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    multiline: boolean;
    keybindings?: typeof keybindings;
    updateFilter: (prefix: string) => void;
    handleInputChange: (value: string, cursorPosition: number) => void;
    cancel: () => void;
    onBlur?: typeof onBlur;
  }>(null!);

  const tokens = useMemo(() => tokenize(value), [value, tokenize]);

  const completions = useCompletions<T>(completionProvider);
  const cursorPosition = useCursorPosition(textareaRef);
  const navigation = useKeyboardNavigation<T>({
    onValueChange,
    onDismiss: completions.dismiss,
    textareaRef,
  });

  const trigger = useCompletionTrigger({
    triggerCharacters,
    onTrigger: (toks, pos, word) => {
      cursorPosition.update();
      completions.fetchCompletions(toks, pos, word);
    },
    tokenize,
  });

  depsRef.current = {
    isOpen: completions.isOpen,
    selectedItem: completions.selectedItem,
    navigate: completions.navigate,
    dismiss: completions.dismiss,
    acceptCompletion: navigation.acceptCompletion,
    triggerManually: trigger.triggerManually,
    onValueChange,
    onExternalKeyDown,
    multiline,
    keybindings,
    updateFilter: completions.updateFilter,
    handleInputChange: trigger.handleInputChange,
    cancel: trigger.cancel,
    onBlur,
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const deps = depsRef.current;
    const textarea = e.currentTarget;
    const wordAtCursor = getWordAtCursor(textarea.value, textarea.selectionStart);

    const handler = createKeyDownHandler<T>({
      isPopoverOpen: deps.isOpen,
      multiline: deps.multiline,
      keybindings: deps.keybindings,
      selectedItem: deps.selectedItem,
      wordAtCursor,
      onAcceptCompletion: deps.acceptCompletion,
      onNavigate: deps.navigate,
      onDismiss: deps.dismiss,
      onCancelTrigger: deps.cancel,
      onManualTrigger: () => {
        deps.triggerManually(textarea.value, textarea.selectionStart);
      },
      onValueChange: deps.onValueChange,
      onExternalKeyDown: deps.onExternalKeyDown,
    });

    handler(e);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value: newValue, selectionStart } = e.currentTarget;
    const deps = depsRef.current;
    deps.onValueChange(newValue);

    const word = getWordAtCursor(newValue, selectionStart);
    if (deps.isOpen) {
      deps.updateFilter(word.word);
    }

    deps.handleInputChange(newValue, selectionStart);
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    const deps = depsRef.current;
    deps.dismiss();
    deps.cancel();
    deps.onBlur?.(e);
  }, []);

  const defaultRenderItem = useCallback((item: { label: string }) => <span>{item.label}</span>, []);
  const renderItem = renderCompletionItem ?? defaultRenderItem;

  const handleItemSelect = useCallback((item: CompletionItem<T>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const wordAtCursor = getWordAtCursor(textarea.value, textarea.selectionStart);
    depsRef.current.acceptCompletion(item, wordAtCursor);
  }, []);

  const whiteSpace = multiline ? "pre-wrap" : ("pre" as const);
  const wordBreak = multiline ? "break-word" : (undefined as CSSProperties["wordBreak"]);

  const gridCell: CSSProperties = {
    gridArea: "1 / 1",
    ...sharedFontStyle,
    whiteSpace,
    wordBreak,
    overflowWrap: multiline ? "break-word" : undefined,
    boxSizing: "border-box",
  };

  return (
    <div
      className={className}
      style={{
        display: "grid",
        ...style,
      }}
      data-ln-expression-editor
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={onFocus}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        rows={multiline ? undefined : 1}
        data-ln-expression-input
        style={{
          ...gridCell,
          display: "block",
          width: "100%",
          resize: multiline ? "vertical" : "none",
          background: "transparent",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          outline: "none",
          overflow: multiline ? "auto" : "hidden",
          margin: 0,
          border: 0,
          zIndex: 1,
        }}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <div
        aria-hidden="true"
        style={{ ...gridCell, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}
        data-ln-expression--tokens
      >
        {tokens.map((token) => (
          <Fragment key={token.start}>
            <Highlighter token={token} />
          </Fragment>
        ))}
      </div>
      {completionProvider && (
        <CompletionPopover
          isOpen={completions.isOpen}
          coordinates={cursorPosition.coordinates}
          className={completionClassName}
        >
          {completions.isLoading && renderLoading ? (
            renderLoading()
          ) : (
            <CompletionList
              items={completions.filteredItems}
              selectedIndex={completions.selectedIndex}
              renderItem={renderItem}
              onSelect={handleItemSelect}
            />
          )}
        </CompletionPopover>
      )}
    </div>
  );
}

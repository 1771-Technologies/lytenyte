import { ExpressionEditor as Expr } from "./expression-editor.js";
import { CompletionListItem } from "./intellisence/completion-item.js";
import { CompletionList } from "./intellisence/completion-list.js";
import { CompletionPopover } from "./intellisence/completion-popover.js";

export const ExpressionEditor = {
  Root: Expr,
  CompletionPopover,
  CompletionList,
  CompletionListItem,
};

export { createCompletionProvider } from "./create-completion-provider.js";
export type { CompletionItem } from "./types.js";

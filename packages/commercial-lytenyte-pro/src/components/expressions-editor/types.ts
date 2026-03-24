export interface Completion {
  readonly label: string;
  readonly kind?: "variable" | "function" | "keyword" | "property";
  readonly detail?: string;
  readonly insertText?: string;
}

export interface CompletionContext {
  readonly expression: string;
  readonly cursor: number;
  readonly word: string;
  readonly wordStart: number;
  readonly wordEnd: number;
}

export interface CompletionProvider {
  readonly name: string;
  getCompletions(ctx: CompletionContext): Completion[] | null | Promise<Completion[] | null>;
}

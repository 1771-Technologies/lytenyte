import type { Token } from "../../expressions/lexer/types.js";
import type { CompletionItem } from "./types.js";

type BuiltinMethod = { label: string; kind: string; value?: string };

const STRING_METHODS: BuiltinMethod[] = [
  { label: "at", kind: "function" },
  { label: "charAt", kind: "function" },
  { label: "charCodeAt", kind: "function" },
  { label: "endsWith", kind: "function" },
  { label: "includes", kind: "function" },
  { label: "indexOf", kind: "function" },
  { label: "lastIndexOf", kind: "function" },
  { label: "length", kind: "number" },
  { label: "match", kind: "function" },
  { label: "padEnd", kind: "function" },
  { label: "padStart", kind: "function" },
  { label: "repeat", kind: "function" },
  { label: "replace", kind: "function" },
  { label: "replaceAll", kind: "function" },
  { label: "slice", kind: "function" },
  { label: "split", kind: "function" },
  { label: "startsWith", kind: "function" },
  { label: "substring", kind: "function" },
  { label: "toLowerCase", kind: "function" },
  { label: "toUpperCase", kind: "function" },
  { label: "trim", kind: "function" },
  { label: "trimEnd", kind: "function" },
  { label: "trimStart", kind: "function" },
];

const ARRAY_METHODS: BuiltinMethod[] = [
  { label: "at", kind: "function" },
  { label: "concat", kind: "function" },
  { label: "entries", kind: "function" },
  { label: "every", kind: "function" },
  { label: "filter", kind: "function" },
  { label: "find", kind: "function" },
  { label: "findIndex", kind: "function" },
  { label: "flat", kind: "function" },
  { label: "flatMap", kind: "function" },
  { label: "forEach", kind: "function" },
  { label: "includes", kind: "function" },
  { label: "indexOf", kind: "function" },
  { label: "join", kind: "function" },
  { label: "keys", kind: "function" },
  { label: "length", kind: "number" },
  { label: "map", kind: "function" },
  { label: "reduce", kind: "function" },
  { label: "reduceRight", kind: "function" },
  { label: "reverse", kind: "function" },
  { label: "slice", kind: "function" },
  { label: "some", kind: "function" },
  { label: "sort", kind: "function" },
  { label: "values", kind: "function" },
];

function isDot(token: Token): boolean {
  return (token.type === "Punctuation" && token.value === ".") || token.type === "OptionalChain";
}

function isClosingBracket(token: Token): boolean {
  return token.type === "Punctuation" && token.value === "]";
}

function isCompleteValue(token: Token): boolean {
  return (
    token.type === "Identifier" ||
    token.type === "QuotedIdentifier" ||
    token.type === "Number" ||
    token.type === "String" ||
    token.type === "TemplateLiteral" ||
    (token.type === "Punctuation" && (token.value === ")" || token.value === "]"))
  );
}

function isStringLiteral(token: Token): boolean {
  return token.type === "String" || token.type === "TemplateLiteral";
}

const BINARY_OPERATORS: BuiltinMethod[] = [
  { label: "+  Plus", kind: "operator", value: "+" },
  { label: "-  Minus", kind: "operator", value: "-" },
  { label: "*  Multiply", kind: "operator", value: "*" },
  { label: "/  Divide", kind: "operator", value: "/" },
  { label: "%  Modulus", kind: "operator", value: "%" },
  { label: "** Exponentiation", kind: "operator", value: "**" },
  { label: "== Equal To", kind: "operator", value: "==" },
  { label: "!= Not Equal To", kind: "operator", value: "!=" },
  { label: "<  Less Than", kind: "operator", value: "<" },
  { label: "<= Less Than Or Equal To", kind: "operator", value: "<=" },
  { label: ">  Greater Than", kind: "operator", value: ">" },
  { label: ">= Greater Than Or Equal To", kind: "operator", value: ">=" },
  { label: "&& AND", kind: "operator", value: "&&" },
  { label: "|| OR", kind: "operator", value: "||" },
  { label: "?? OR if Null", kind: "operator", value: "??" },
  { label: "|> Pipe", kind: "operator", value: "|>" },
];

type Analysis =
  | { kind: "top-level" }
  | { kind: "context-path"; path: string[] }
  | { kind: "string-literal" }
  | { kind: "array-literal" }
  | { kind: "after-value" }
  | { kind: "none" };

function analyzeTokens(tokens: Token[], cursorPosition: number): Analysis {
  const relevant = tokens.filter(
    (t) => t.end <= cursorPosition && t.type !== "EOF" && t.type !== "Whitespace",
  );

  if (relevant.length === 0) return { kind: "top-level" };

  let i = relevant.length - 1;

  // Skip the partial word the user is currently typing (only if cursor is at its end)
  if (relevant[i].type === "Identifier" && relevant[i].end === cursorPosition) i--;

  if (i < 0) return { kind: "top-level" };

  // If the token before the word isn't a dot, check if it's a complete value
  if (!isDot(relevant[i])) {
    if (isCompleteValue(relevant[i])) return { kind: "after-value" };
    return { kind: "top-level" };
  }

  // Step over the dot
  i--;

  if (i < 0) return { kind: "none" };

  const beforeDot = relevant[i];

  // "hello". or `hello`. → string methods
  if (isStringLiteral(beforeDot)) return { kind: "string-literal" };

  // [1,2,3]. → array methods
  if (isClosingBracket(beforeDot)) return { kind: "array-literal" };

  // identifier chain: walk back through alternating Identifier / QuotedIdentifier / dot tokens
  if (beforeDot.type === "Identifier" || beforeDot.type === "QuotedIdentifier") {
    const tokenName = (t: Token) => (t.type === "QuotedIdentifier" ? t.value.slice(2, -1) : t.value);
    const path: string[] = [tokenName(beforeDot)];
    i--;

    while (i >= 1) {
      if (!isDot(relevant[i])) break;
      i--;
      if (relevant[i].type !== "Identifier" && relevant[i].type !== "QuotedIdentifier") break;
      path.unshift(tokenName(relevant[i]));
      i--;
    }

    return { kind: "context-path", path };
  }

  return { kind: "none" };
}

function resolveValue(context: Record<string, unknown>, path: string[]): unknown {
  let current: unknown = context;
  for (const key of path) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function kindOf(value: unknown): string {
  if (typeof value === "function") return "function";
  if (Array.isArray(value)) return "array";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "object" && value !== null) return "object";
  return "unknown";
}

const VALID_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

function objectCompletions(obj: object): CompletionItem[] {
  return Object.entries(obj).map(([key, val]) => ({
    label: key,
    kind: kindOf(val),
    id: key,
    value: VALID_IDENTIFIER.test(key) ? undefined : `@"${key}"`,
  }));
}

function builtinCompletions(methods: BuiltinMethod[]): CompletionItem[] {
  return methods.map((m) => ({ label: m.label, kind: m.kind, id: m.label, value: m.value }));
}

function binaryOperatorCompletions(): CompletionItem[] {
  return builtinCompletions(BINARY_OPERATORS);
}

export function createCompletionProvider(context: Record<string, unknown>) {
  return function completionProvider(tokens: Token[], cursorPosition: number): CompletionItem[] {
    const analysis = analyzeTokens(tokens, cursorPosition);

    switch (analysis.kind) {
      case "top-level":
        return objectCompletions(context);

      case "string-literal":
        return builtinCompletions(STRING_METHODS);

      case "array-literal":
        return builtinCompletions(ARRAY_METHODS);

      case "context-path": {
        const value = resolveValue(context, analysis.path);
        if (value == null) return [];
        if (typeof value === "string") return builtinCompletions(STRING_METHODS);
        if (Array.isArray(value)) return builtinCompletions(ARRAY_METHODS);
        if (typeof value === "object") return objectCompletions(value);
        return [];
      }

      case "after-value":
        return binaryOperatorCompletions();

      case "none":
        return [];
    }
  };
}

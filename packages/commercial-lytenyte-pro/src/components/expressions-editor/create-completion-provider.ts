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

const NUMBER_METHODS: BuiltinMethod[] = [
  { label: "toExponential", kind: "function" },
  { label: "toFixed", kind: "function" },
  { label: "toLocaleString", kind: "function" },
  { label: "toPrecision", kind: "function" },
  { label: "toString", kind: "function" },
  { label: "valueOf", kind: "function" },
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

export type ContextEntry = {
  value: unknown;
  type: "string" | "number" | "array" | "object" | "function" | "boolean";
  return?: "string" | "number" | "array" | "object";
};

type CompletionContext = Record<string, ContextEntry>;

type ResolvedType = "string" | "number" | "array" | "object" | "unknown";

const STRING_METHOD_RETURNS: Record<string, ResolvedType> = {
  at: "string",
  charAt: "string",
  charCodeAt: "number",
  endsWith: "unknown",
  includes: "unknown",
  indexOf: "number",
  lastIndexOf: "number",
  match: "array",
  padEnd: "string",
  padStart: "string",
  repeat: "string",
  replace: "string",
  replaceAll: "string",
  slice: "string",
  split: "array",
  startsWith: "unknown",
  substring: "string",
  toLowerCase: "string",
  toUpperCase: "string",
  trim: "string",
  trimEnd: "string",
  trimStart: "string",
};

const ARRAY_METHOD_RETURNS: Record<string, ResolvedType> = {
  at: "unknown",
  concat: "array",
  entries: "unknown",
  every: "unknown",
  filter: "array",
  find: "unknown",
  findIndex: "number",
  flat: "array",
  flatMap: "array",
  forEach: "unknown",
  includes: "unknown",
  indexOf: "number",
  join: "string",
  keys: "unknown",
  map: "array",
  reduce: "unknown",
  reduceRight: "unknown",
  reverse: "array",
  slice: "array",
  some: "unknown",
  sort: "array",
  values: "unknown",
};

function kindOf(value: unknown): string {
  if (typeof value === "function") return "function";
  if (Array.isArray(value)) return "array";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "object" && value !== null) return "object";
  return "unknown";
}

function isContextEntry(v: unknown): v is ContextEntry {
  return v != null && typeof v === "object" && "type" in v && "value" in v;
}

function resolveEntry(context: CompletionContext, path: string[]): ContextEntry | undefined {
  if (path.length === 0) return undefined;
  let entry: ContextEntry | undefined = context[path[0]];
  for (let i = 1; i < path.length; i++) {
    if (!entry || entry.value == null || typeof entry.value !== "object") return undefined;
    const nested: unknown = (entry.value as Record<string, unknown>)[path[i]];
    if (isContextEntry(nested)) {
      entry = nested;
    } else if (nested !== undefined) {
      entry = { value: nested, type: kindOf(nested) as ContextEntry["type"] };
    } else {
      return undefined;
    }
  }
  return entry;
}

function findMatchingOpenParen(relevant: Token[], closeIndex: number): number {
  let depth = 1;
  let i = closeIndex - 1;
  while (i >= 0) {
    if (relevant[i].type === "Punctuation") {
      if (relevant[i].value === ")") depth++;
      else if (relevant[i].value === "(") {
        if (--depth === 0) return i;
      }
    }
    i--;
  }
  return -1;
}

function buildPathFromTokens(relevant: Token[], i: number): string[] | null {
  const tokenName = (t: Token) => (t.type === "QuotedIdentifier" ? t.value.slice(2, -1) : t.value);
  const token = relevant[i];
  if (!token || (token.type !== "Identifier" && token.type !== "QuotedIdentifier")) return null;
  const path: string[] = [tokenName(token)];
  let j = i - 1;
  while (j >= 1 && isDot(relevant[j])) {
    j--;
    if (relevant[j].type !== "Identifier" && relevant[j].type !== "QuotedIdentifier") break;
    path.unshift(tokenName(relevant[j]));
    j--;
  }
  return path;
}

function resolveTypeOf(relevant: Token[], i: number, context: CompletionContext): ResolvedType {
  const token = relevant[i];
  if (!token) return "unknown";

  if (isStringLiteral(token)) return "string";
  if (isClosingBracket(token)) return "array";

  if (token.type === "Punctuation" && token.value === ")") {
    const openIdx = findMatchingOpenParen(relevant, i);
    if (openIdx < 1) return "unknown";
    const methodToken = relevant[openIdx - 1];
    if (methodToken?.type !== "Identifier") return "unknown";

    const hasDot = openIdx >= 2 && isDot(relevant[openIdx - 2]);

    if (!hasDot) {
      // Top-level function call: fn(...)
      const funcEntry = context[methodToken.value];
      if (funcEntry?.type === "function" && funcEntry.return) return funcEntry.return as ResolvedType;
      return "unknown";
    }

    // Method call: receiver.method(...)
    // First try resolving the receiver as a context object to find a typed method entry
    const receiverPath = buildPathFromTokens(relevant, openIdx - 3);
    if (receiverPath) {
      const receiverEntry = resolveEntry(context, receiverPath);
      if (receiverEntry?.type === "object" && receiverEntry.value != null) {
        const methodVal = (receiverEntry.value as Record<string, unknown>)[methodToken.value];
        const methodEntry = isContextEntry(methodVal) ? methodVal : undefined;
        if (methodEntry?.type === "function" && methodEntry.return) return methodEntry.return as ResolvedType;
      }
    }

    // Fall back to builtin method return-type maps (string/array prototype methods)
    const receiverType = resolveTypeOf(relevant, openIdx - 3, context);
    if (receiverType === "string") return STRING_METHOD_RETURNS[methodToken.value] ?? "unknown";
    if (receiverType === "array") return ARRAY_METHOD_RETURNS[methodToken.value] ?? "unknown";
    return "unknown";
  }

  if (token.type === "Identifier" || token.type === "QuotedIdentifier") {
    const path = buildPathFromTokens(relevant, i);
    if (!path) return "unknown";
    const entry = resolveEntry(context, path);
    const kind = entry?.type ?? "unknown";
    if (kind === "string" || kind === "number" || kind === "array" || kind === "object") return kind;
    return "unknown";
  }

  return "unknown";
}

type Analysis =
  | { kind: "top-level" }
  | { kind: "context-path"; path: string[] }
  | { kind: "string-literal" }
  | { kind: "number-value" }
  | { kind: "array-literal" }
  | { kind: "after-value" }
  | { kind: "none" };

function analyzeTokens(tokens: Token[], cursorPosition: number, context: CompletionContext): Analysis {
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

  // fn(). → resolve call return type recursively
  if (beforeDot.type === "Punctuation" && beforeDot.value === ")") {
    const resultType = resolveTypeOf(relevant, i, context);
    if (resultType === "string") return { kind: "string-literal" };
    if (resultType === "number") return { kind: "number-value" };
    if (resultType === "array") return { kind: "array-literal" };
    return { kind: "none" };
  }

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

const VALID_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

function objectCompletions(obj: object): CompletionItem[] {
  return Object.entries(obj).map(([key, val]) => ({
    label: key,
    kind: isContextEntry(val) ? val.type : kindOf(val),
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

export function createCompletionProvider(context: CompletionContext) {
  return function completionProvider(tokens: Token[], cursorPosition: number): CompletionItem[] {
    const analysis = analyzeTokens(tokens, cursorPosition, context);

    switch (analysis.kind) {
      case "top-level":
        return objectCompletions(context);

      case "string-literal":
        return builtinCompletions(STRING_METHODS);

      case "number-value":
        return builtinCompletions(NUMBER_METHODS);

      case "array-literal":
        return builtinCompletions(ARRAY_METHODS);

      case "context-path": {
        const entry = resolveEntry(context, analysis.path);
        if (!entry) return [];
        if (entry.type === "string") return builtinCompletions(STRING_METHODS);
        if (entry.type === "number") return builtinCompletions(NUMBER_METHODS);
        if (entry.type === "array") return builtinCompletions(ARRAY_METHODS);
        if (entry.type === "object" && entry.value != null && typeof entry.value === "object")
          return objectCompletions(entry.value as object);
        return [];
      }

      case "after-value":
        return binaryOperatorCompletions();

      case "none":
        return [];
    }
  };
}

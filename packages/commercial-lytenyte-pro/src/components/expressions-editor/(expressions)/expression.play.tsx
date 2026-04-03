import { useState, useCallback, useMemo } from "react";
import { ExpressionEditor } from "../index.js";
import type { CompletionItem } from "../index.js";
import "./expression.css";
import { Evaluator, standardPlugins } from "../../../expressions/index.js";
import type { Token } from "../../../expressions/lexer/types.js";

type ExprCompletion = {
  description: string;
};

const CONTEXT: Record<string, Record<string, unknown> | string | number> = {
  user: {
    name: "Alice",
    age: 30,
    email: "alice@example.com",
    address: {
      city: "Portland",
      state: "OR",
      zip: "97201",
    },
  },
  order: {
    total: 99.99,
    status: "shipped",
    items: 3,
  },
  Math: {
    PI: 3.14159,
    abs: "function",
    max: "function",
    min: "function",
    round: "function",
  },
};

function highlightToken(token: Token) {
  const className = `token-unknown`;
  const element = <span className={className}>{token.value}</span>;

  return element;
}

function resolveContext(path: string[]): Record<string, unknown> | null {
  let current: unknown = CONTEXT;

  for (const segment of path) {
    if (current && typeof current === "object" && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return null;
    }
  }

  if (current && typeof current === "object") {
    return current as Record<string, unknown>;
  }

  return null;
}

function buildPathBeforeCursor(
  tokens: Token[],
  cursorPosition: number,
): { path: string[]; endsWithDot: boolean } {
  const relevantTokens = tokens.filter((t) => t.end <= cursorPosition);
  const path: string[] = [];
  let endsWithDot = false;

  let i = relevantTokens.length - 1;

  if (i >= 0 && relevantTokens[i].type === "dot") {
    endsWithDot = true;
    i--;
  }

  while (i >= 0) {
    const token = relevantTokens[i];
    if (token.type === "identifier") {
      path.unshift(token.value);
      i--;
      if (i >= 0 && relevantTokens[i].type === "dot") {
        i--;
        continue;
      }
    }
    break;
  }

  return { path, endsWithDot };
}

function completionProvider(tokens: Token[], cursorPosition: number): CompletionItem<ExprCompletion>[] {
  const { path, endsWithDot } = buildPathBeforeCursor(tokens, cursorPosition);

  let target: Record<string, unknown> | null;

  if (endsWithDot) {
    target = resolveContext(path);
  } else if (path.length > 1) {
    target = resolveContext(path.slice(0, -1));
  } else {
    target = CONTEXT;
  }

  if (!target) return [];

  return Object.entries(target).map(([key, val]) => ({
    label: key,
    kind: typeof val === "object" && val !== null ? "object" : typeof val,
    id: key,
    description: typeof val === "object" ? "{...}" : String(val),
  }));
}

function renderCompletionItem(item: CompletionItem<ExprCompletion>) {
  return (
    <div className="completion-item">
      <span className="completion-kind">{item.kind}</span>
      <span className="completion-label">{item.label}</span>
      <span className="completion-desc">{item.description}</span>
    </div>
  );
}

const EXAMPLES: { label: string; value: string; multiline?: boolean }[] = [
  {
    label: "Property access",
    value: "user.address.city",
  },
  {
    label: "Math",
    value: "Math.round(order.total * 1.08)",
  },
  {
    label: "Conditional",
    value: "if order.total > 100 and user.age >= 18",
  },
  {
    label: "Object literal",
    value: "{name: user.name, total: order.total, tax: order.total * 0.08}",
  },
  {
    label: "Error token",
    value: "user.name or undefined",
  },
];

export default function App() {
  const [value, setValue] = useState("user.name");
  const evaluator = useMemo(() => new Evaluator(standardPlugins), []);

  const tokensize = useCallback((input: string) => evaluator.tokensSafe(input, true), [evaluator]);

  const handleHighlight = useCallback((t: Token) => highlightToken(t), []);

  return (
    <div className="demo-container">
      <section className="demo-section">
        <label className="demo-label">Single-line</label>
        <ExpressionEditor
          value={value}
          onValueChange={setValue}
          tokenize={tokensize}
          highlight={handleHighlight}
          completionProvider={completionProvider}
          renderCompletionItem={renderCompletionItem}
          placeholder="Type an expression..."
        />
        <div className="examples-row">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              className={`example-btn${value === ex.value ? "active" : ""}`}
              onClick={() => setValue(ex.value)}
            >
              {ex.label}
            </button>
          ))}
        </div>
        <span className="hint">
          Try <code>user.</code> or <code>order.</code> — press <kbd>Ctrl+Space</kbd> for suggestions. Type{" "}
          <code>undefined</code> for error squiggles.
        </span>
      </section>
    </div>
  );
}

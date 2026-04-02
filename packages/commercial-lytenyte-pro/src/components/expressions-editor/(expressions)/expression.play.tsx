import { useState, useCallback, useMemo } from "react";
import { ExpressionEditor, ErrorTooltip } from "../index.js";
import type { Token, CompletionItem } from "../index.js";
import "./expression.css";
import { Evaluator, standardPlugins } from "../../../expressions/index.js";

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
  const className = `token-${token.type}`;
  const element = <span className={className}>{token.text}</span>;

  if (token.error) {
    return <ErrorTooltip token={token}>{element}</ErrorTooltip>;
  }

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
      path.unshift(token.text);
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

const API_METHODS: Record<string, { kind: string; description: string }[]> = {
  fetch: [
    { kind: "method", description: "GET request" },
    { kind: "method", description: "POST request" },
  ],
  response: [
    { kind: "property", description: "Response body as JSON" },
    { kind: "property", description: "HTTP status code" },
    { kind: "property", description: "Response headers" },
    { kind: "method", description: "Read body as text" },
  ],
  db: [
    { kind: "method", description: "Find records" },
    { kind: "method", description: "Insert a record" },
    { kind: "method", description: "Update records" },
    { kind: "method", description: "Delete records" },
    { kind: "method", description: "Execute raw query" },
  ],
};

const API_COMPLETIONS: Record<string, string[]> = {
  fetch: ["get", "post"],
  response: ["json", "status", "headers", "text"],
  db: ["find", "insert", "update", "delete", "query"],
};

async function asyncCompletionProvider(
  tokens: Token[],
  cursorPosition: number,
): Promise<CompletionItem<ExprCompletion>[]> {
  await new Promise((r) => setTimeout(r, 600));

  const { path, endsWithDot } = buildPathBeforeCursor(tokens, cursorPosition);

  if (endsWithDot && path.length === 1) {
    const key = path[0];
    const methods = API_COMPLETIONS[key];
    const details = API_METHODS[key];
    if (methods && details) {
      return methods.map((m, i) => ({
        label: m,
        kind: details[i].kind,
        id: m,
        description: details[i].description,
      }));
    }
  }

  const topLevel = ["fetch", "response", "db", "console", "env"];
  return topLevel.map((name) => ({
    label: name,
    kind: "module",
    id: name,
    description: `${name} module`,
  }));
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

const MULTILINE_EXAMPLES: { label: string; value: string }[] = [
  {
    label: "Arrow function",
    value: `const discount = (total) => {
  if total > 100
    return total * 0.9
  else
    return total
}`,
  },
  {
    label: "Data transform",
    value: `const result = {
  name: user.name,
  email: user.email,
  city: user.address.city,
  order_total: Math.round(order.total),
  status: order.status
}`,
  },
  {
    label: "Validation",
    value: `const valid = (
  typeof user.name == "string"
  and user.age >= 18
  and order.total > 0
  and not (order.status == "cancelled")
)`,
  },
];

export default function App() {
  const [value, setValue] = useState("user.name");
  const [asyncValue, setAsyncValue] = useState("");
  const [multilineValue, setMultilineValue] = useState(MULTILINE_EXAMPLES[0].value);

  const evaluator = useMemo(() => new Evaluator(standardPlugins), []);

  const handleHighlight = useCallback((t: Token) => highlightToken(t), []);

  return (
    <div className="demo-container">
      <header className="demo-header">
        <h1>ab-expr</h1>
        <p>Expression editor with syntax highlighting and intellisense</p>
      </header>

      <section className="demo-section">
        <label className="demo-label">Single-line</label>
        <ExpressionEditor<ExprCompletion>
          value={value}
          onValueChange={setValue}
          tokenize={evaluator.tokensSafe}
          highlight={handleHighlight}
          completionProvider={completionProvider}
          renderCompletionItem={renderCompletionItem}
          placeholder="Type an expression..."
          className="expr-editor"
          completionClassName="completion-popover"
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

      <section className="demo-section">
        <label className="demo-label">Multiline</label>
        <ExpressionEditor<ExprCompletion>
          value={multilineValue}
          onValueChange={setMultilineValue}
          tokenize={tokenize}
          highlight={handleHighlight}
          completionProvider={completionProvider}
          renderCompletionItem={renderCompletionItem}
          multiline
          placeholder="Write a multi-line expression..."
          className="expr-editor-multi"
          completionClassName="completion-popover"
        />
        <div className="examples-row">
          {MULTILINE_EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              className={`example-btn${multilineValue === ex.value ? "active" : ""}`}
              onClick={() => setMultilineValue(ex.value)}
            >
              {ex.label}
            </button>
          ))}
        </div>
        <span className="hint">
          Multiline mode with auto-indentation. Use <kbd>Enter</kbd> for new lines.
        </span>
      </section>

      <section className="demo-section">
        <label className="demo-label">Async completions</label>
        <ExpressionEditor<ExprCompletion>
          value={asyncValue}
          onValueChange={setAsyncValue}
          tokenize={tokenize}
          highlight={handleHighlight}
          completionProvider={asyncCompletionProvider}
          renderCompletionItem={renderCompletionItem}
          renderLoading={() => <div className="completion-loading">Loading...</div>}
          placeholder="Try db. or fetch. (async, 600ms delay)"
          className="expr-editor"
          completionClassName="completion-popover"
        />
        <span className="hint">
          Completions load asynchronously with a 600ms delay to simulate an API call.
        </span>
      </section>

      <section className="output-section">
        <label className="demo-label">Output</label>
        <div className="output-box">
          <div className="output-row">
            <span className="output-key">single</span>
            <span className="output-val">{value || "—"}</span>
          </div>
          <div className="output-row">
            <span className="output-key">multi</span>
            <span className="output-val">{multilineValue.split("\n")[0] || "—"}...</span>
          </div>
          <div className="output-row">
            <span className="output-key">async</span>
            <span className="output-val">{asyncValue || "—"}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

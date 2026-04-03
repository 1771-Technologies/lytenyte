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
  const [multilineValue, setMultilineValue] = useState(MULTILINE_EXAMPLES[0].value);

  const evaluator = useMemo(() => new Evaluator(standardPlugins), []);

  const tokensize = useCallback((input: string) => evaluator.tokensSafe(input, true), [evaluator]);

  const handleHighlight = useCallback((t: Token) => highlightToken(t), []);

  return (
    <div className="demo-container">
      <section className="demo-section">
        <label className="demo-label">Multiline</label>
        <ExpressionEditor<ExprCompletion>
          value={multilineValue}
          onValueChange={setMultilineValue}
          tokenize={tokensize}
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

      <section className="output-section">
        <label className="demo-label">Output</label>
        <div className="output-box">
          <div className="output-row">
            <span className="output-key">multi</span>
            <span className="output-val">{multilineValue.split("\n")[0] || "—"}...</span>
          </div>
        </div>
      </section>
    </div>
  );
}

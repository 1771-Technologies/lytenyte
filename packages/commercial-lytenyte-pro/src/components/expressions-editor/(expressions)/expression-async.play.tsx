import { useState, useCallback, useMemo } from "react";
import { ExpressionEditor } from "../index.js";
import type { CompletionItem } from "../index.js";
import "./expression.css";
import { Evaluator, standardPlugins } from "../../../expressions/index.js";
import type { Token } from "../../../expressions/lexer/types.js";

type ExprCompletion = {
  description: string;
};

function highlightToken(token: Token) {
  const className = `token-unknown`;
  const element = <span className={className}>{token.value}</span>;

  return element;
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

export default function App() {
  const [asyncValue, setAsyncValue] = useState("");

  const evaluator = useMemo(() => new Evaluator(standardPlugins), []);

  const tokensize = useCallback((input: string) => evaluator.tokensSafe(input, true), [evaluator]);

  const handleHighlight = useCallback((t: Token) => highlightToken(t), []);

  return (
    <div className="demo-container">
      <section className="demo-section">
        <label className="demo-label">Async completions</label>
        <ExpressionEditor<ExprCompletion>
          value={asyncValue}
          onValueChange={setAsyncValue}
          tokenize={tokensize}
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
            <span className="output-key">async</span>
            <span className="output-val">{asyncValue || "—"}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

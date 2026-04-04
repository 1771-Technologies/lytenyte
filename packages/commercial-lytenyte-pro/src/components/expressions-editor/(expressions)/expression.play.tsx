import { useState, useCallback, useMemo } from "react";
import { createCompletionProvider, ExpressionEditor } from "../index.js";
import type { CompletionItem } from "../index.js";
import { Evaluator, standardPlugins } from "../../../expressions/index.js";

import "../../../../css/light-dark.css";
import "../../../../css/components/expression-editor.css";
import "./expression.css";

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

  const tokenize = useCallback((input: string) => evaluator.tokensSafe(input, true), [evaluator]);
  const provider = useMemo(() => {
    return createCompletionProvider(CONTEXT);
  }, []);

  return (
    <div className="demo-container">
      <label className="demo-label">Single-line</label>
      <ExpressionEditor
        value={value}
        onChange={setValue}
        tokenize={tokenize}
        completionProvider={provider}
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
    </div>
  );
}

import "../../../../css/components/expression-editor.css";
import "./expression.css";
import { useMemo, useState } from "react";
import { EditorRoot } from "../root.js";
import { EditorInput } from "../input.js";
import { Evaluator, standardPlugins } from "../../../expressions/index.js";
import { EditorHighlight } from "../highlight.js";
import { EditorCompletions } from "../completions.js";
import type { CompletionProvider } from "../types.js";

const demoContext: Record<string, unknown> = {
  name: "Alice",
  age: 30,
  isActive: true,
  score: 95.5,
  greet: (n: string) => `Hello, ${n}!`,
  multiply: (a: number, b: number) => a * b,
  PI: Math.PI,
};

const completionProvider: CompletionProvider = {
  name: "context",
  getCompletions: () =>
    Object.entries(demoContext).map(([key, value]) => ({
      label: key,
      kind: typeof value === "function" ? "function" : "variable",
      detail: typeof value === "function" ? "fn()" : JSON.stringify(value).slice(0, 20),
    })),
};

export default function ExpressionPlay() {
  const [expression, setExpression] = useState("score * 2 + age");
  const evaluator = useMemo(() => new Evaluator(standardPlugins), []);
  const completionProviders = useMemo(() => [completionProvider], []);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <p style={{ marginBottom: 8, fontSize: 13, color: "#666" }}>
        <kbd>Ctrl+Space</kbd> for completions · <kbd>↑↓</kbd> navigate · <kbd>Tab</kbd>
        /<kbd>Enter</kbd> accept · <kbd>Esc</kbd> dismiss
      </p>
      <EditorRoot
        expression={expression}
        onExpressionChange={setExpression}
        evaluator={evaluator}
        completionProviders={completionProviders}
      >
        <div className="expr2-field">
          <EditorHighlight />
          <EditorInput />
          <EditorCompletions />
        </div>
      </EditorRoot>
    </div>
  );
}

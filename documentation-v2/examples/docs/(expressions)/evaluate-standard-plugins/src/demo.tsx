import "@1771technologies/lytenyte-pro/light-dark.css";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/expression-editor.css";
import { Evaluator, ExpressionEditor, standardPlugins } from "@1771technologies/lytenyte-pro/expressions";
import { useCallback, useMemo, useState } from "react";
import { ContextRows, tw, TYPE_COLORS } from "./components.js";

const evaluator = new Evaluator(standardPlugins);

const context = {
  user: {
    firstName: "John",
    lastName: "Smith",
  },
  age: 23,
  location: "London",

  fullName: () => context.user.firstName + "  " + context.user.lastName,
};

const EXAMPLE_PILLS = [
  'user.firstName + " " + user.lastName',
  "`${user.firstName} is ${age} old`",
  "age * 2",
  "fullName()",
];

export default function EvaluatorBasics() {
  const [value, setValue] = useState("age * 2");

  const result = useMemo(() => {
    try {
      if (!value) return "";

      return evaluator.run(value, context);
    } catch (e) {
      return e instanceof Error ? e : new Error(String(e));
    }
  }, [value]);

  const tokenize = useCallback((s: string) => evaluator.tokensSafe(s, true), []);

  const isError = result instanceof Error;

  return (
    <div className="flex flex-col gap-5 p-5">
      <label className="flex w-full flex-col gap-2">
        <div>
          <div className="text-ln-text-dark text-sm font-semibold">Expression</div>
        </div>

        <div data-ln-input="true" className="h-8 rounded-xl text-sm">
          <ExpressionEditor.Root className="text-sm" value={value} onChange={setValue} tokenize={tokenize} />
        </div>
      </label>
      <div className="flex flex-col gap-2">
        <div className="text-ln-text-light text-xs font-medium">Result</div>
        <div
          className={`flex h-10 items-center gap-3 rounded-xl border px-4 py-3 font-mono text-sm ${
            isError
              ? "border-ln-red-30 bg-ln-red-10 text-ln-red-70"
              : "border-ln-border bg-ln-bg-light text-ln-text-dark"
          }`}
        >
          <span className="min-w-0 flex-1 truncate">{isError ? result.message : String(result)}</span>
          <span
            className={tw(
              "shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-medium",
              !isError && TYPE_COLORS[typeof result],
              isError && "bg-ln-red-30 text-ln-red-90",
            )}
          >
            {isError ? "error" : typeof result}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-ln-text-light text-xs font-medium">Illustrative Examples</div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PILLS.map((expr) => (
            <button
              key={expr}
              type="button"
              onClick={() => setValue(expr)}
              className="border-ln-border bg-ln-bg text-ln-text-dark hover:border-ln-primary-50 hover:bg-ln-primary-10 hover:text-ln-primary-50 cursor-pointer rounded-full border px-3 py-1 font-mono text-xs transition-colors"
            >
              {expr}
            </button>
          ))}
        </div>
      </div>

      {/* Context */}
      <div className="flex flex-col gap-2">
        <div className="text-ln-text-light text-xs font-medium">Context</div>
        <div className="border-ln-border bg-ln-bg-light divide-ln-border divide-y overflow-hidden rounded-lg border">
          <ContextRows obj={context as Record<string, unknown>} />
        </div>
      </div>
    </div>
  );
}

import "@1771technologies/lytenyte-pro/light-dark.css";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/expression-editor.css";
import { Evaluator, ExpressionEditor } from "@1771technologies/lytenyte-pro/expressions";
import { useCallback, useMemo, useState } from "react";

const evaluator = new Evaluator();

const EXAMPLE_PILLS = ["1 + 1", "2 * 3 + 4", "20 + 10 / 4 - (2 * 4)"];

export default function EvaluatorBasics() {
  const [value, setValue] = useState("1 + 1");

  const result = useMemo(() => {
    try {
      if (!value) return "";

      return evaluator.run(value);
    } catch (e) {
      return e instanceof Error ? e : new Error(String(e));
    }
  }, [value]);

  const tokenize = useCallback((s: string) => evaluator.tokensSafe(s, true), []);

  const isError = result instanceof Error;

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Label + editor */}
      <label className="flex w-full flex-col gap-2">
        <div>
          <div className="text-ln-text-dark text-sm font-semibold">Expression</div>
          <div className="text-ln-text-light text-xs">
            Type an expression below and see its result evaluated in real time.
          </div>
        </div>

        <div data-ln-input="true" className="h-10 text-base">
          <ExpressionEditor.Root value={value} onChange={setValue} tokenize={tokenize} />
        </div>
      </label>

      {/* Example pills */}
      <div className="flex flex-col gap-2">
        <div className="text-ln-text-light text-xs font-medium">Try an example</div>
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

      {/* Result */}
      <div className="flex flex-col gap-2">
        <div className="text-ln-text-light text-xs font-medium">Result</div>
        <div
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 font-mono text-sm ${
            isError
              ? "border-ln-red-30 bg-ln-red-10 text-ln-red-70"
              : "border-ln-border bg-ln-bg-light text-ln-text-dark"
          }`}
        >
          <span className="min-w-0 flex-1 truncate">{isError ? result.message : String(result)}</span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-medium ${
              isError ? "bg-ln-red-30 text-ln-red-90" : "bg-ln-primary-10 text-ln-primary-70"
            }`}
          >
            {isError ? "error" : typeof result}
          </span>
        </div>
      </div>
    </div>
  );
}

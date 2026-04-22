import "@1771technologies/lytenyte-pro/light-dark.css";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/expression-editor.css";
import {
  Evaluator,
  ExpressionEditor,
  standardPlugins,
} from "@1771technologies/lytenyte-pro/expressions";
import { useCallback, useMemo, useState } from "react";

const evaluator = new Evaluator(standardPlugins);

const EXAMPLES = [
  "1 + 2 * 3",
  '"hello".toUpperCase()',
  "[1, 2, 3].length",
  "true && false || true",
  "100 > 50 ? 'big' : 'small'",
];

export default function ExpressionEditorBasic() {
  const [value, setValue] = useState("1 + 2 * 3");

  const result = useMemo(() => {
    try {
      if (!value) return null;
      return { ok: true, value: evaluator.run(value) };
    } catch (e) {
      return { ok: false, value: e instanceof Error ? e.message : String(e) };
    }
  }, [value]);

  const tokenize = useCallback((s: string) => evaluator.tokensSafe(s, true), []);

  return (
    <div className="flex flex-col gap-5 p-5">
      <label className="flex flex-col gap-2">
        <div>
          <div className="text-ln-text-dark text-sm font-semibold">Expression</div>
          <div className="text-ln-text-light text-xs">
            Syntax highlighting with no completion UI — just pass{" "}
            <code className="font-mono">tokenize</code> to{" "}
            <code className="font-mono">ExpressionEditor.Root</code>.
          </div>
        </div>

        <div data-ln-input="true" className="h-10 text-base">
          <ExpressionEditor.Root value={value} onChange={setValue} tokenize={tokenize} />
        </div>
      </label>

      <div className="flex flex-col gap-2">
        <div className="text-ln-text-light text-xs font-medium">Try an example</div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((expr) => (
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

      {result && (
        <div className="flex flex-col gap-2">
          <div className="text-ln-text-light text-xs font-medium">Result</div>
          <div
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 font-mono text-sm ${
              result.ok
                ? "border-ln-border bg-ln-bg-light text-ln-text-dark"
                : "border-ln-red-30 bg-ln-red-10 text-ln-red-70"
            }`}
          >
            <span className="min-w-0 flex-1 truncate">{String(result.value)}</span>
            {result.ok && (
              <span className="bg-ln-primary-10 text-ln-primary-70 shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-medium">
                {typeof result.value}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

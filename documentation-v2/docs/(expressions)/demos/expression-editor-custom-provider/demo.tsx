import "@1771technologies/lytenyte-pro/light-dark.css";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/expression-editor.css";
import { Evaluator, ExpressionEditor, standardPlugins } from "@1771technologies/lytenyte-pro/expressions";
import type { CompletionItem, Token } from "@1771technologies/lytenyte-pro/expressions";
import { useCallback, useMemo, useState } from "react";
import { ContextRows, KindBadge, tw } from "./components.js";
import { TYPE_COLORS } from "../evaluate-standard-plugins/components.jsx";

const evaluator = new Evaluator(standardPlugins);

// A domain context representing a sales dataset row
const context = {
  Revenue: 84200,
  Quantity: 34,
  Region: "West",
  Product: "Laptop Pro",
  Discount: 0.1,
  InStock: true,
};

// Formula functions available to users
const FORMULA_FUNCTIONS: CompletionItem[] = [
  { label: "round", kind: "function", id: "round" },
  { label: "floor", kind: "function", id: "floor" },
  { label: "ceil", kind: "function", id: "ceil" },
  { label: "abs", kind: "function", id: "abs" },
  { label: "min", kind: "function", id: "min" },
  { label: "max", kind: "function", id: "max" },
];

const CONTEXT_FIELDS: CompletionItem[] = Object.entries(context).map(([key, val]) => ({
  label: key,
  kind: typeof val === "number" ? "number" : typeof val === "boolean" ? "boolean" : "string",
  id: key,
}));

// Custom completion provider: injects formula functions and context fields.
// Returns formula functions when the cursor is at a fresh expression start (no dot chain),
// and field properties when after a dot.
function customProvider(tokens: Token[], cursorPosition: number): CompletionItem[] {
  const relevant = tokens.filter(
    (t) => t.end <= cursorPosition && t.type !== "EOF" && t.type !== "Whitespace",
  );

  if (relevant.length === 0) return [...FORMULA_FUNCTIONS, ...CONTEXT_FIELDS];

  let i = relevant.length - 1;
  // Skip a partial identifier the user is typing
  if (relevant[i]?.type === "Identifier") i--;

  if (i < 0) return [...FORMULA_FUNCTIONS, ...CONTEXT_FIELDS];

  const prev = relevant[i];

  // After a dot → no completions (context fields are primitives with no useful sub-properties)
  if (prev.type === "Punctuation" && prev.value === ".") return [];

  // Any other position: top-level suggestions
  return [...FORMULA_FUNCTIONS, ...CONTEXT_FIELDS];
}

const formulaContext = {
  ...context,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil,
  abs: Math.abs,
  min: Math.min,
  max: Math.max,
};

const EXAMPLES = [
  "Revenue * (1 - Discount)",
  "round(Revenue / Quantity)",
  "Region == 'West' ? Revenue * 1.1 : Revenue",
  "InStock && Quantity > 20",
];

export default function CustomProvider() {
  const [value, setValue] = useState("Revenue * (1 - Discount)");

  const result = useMemo(() => {
    try {
      if (!value) return "";

      return evaluator.run(value, formulaContext);
    } catch (e) {
      return e instanceof Error ? e : new Error(String(e));
    }
  }, [value]);

  const tokenize = useCallback((s: string) => evaluator.tokensSafe(s, true), []);
  const isError = result instanceof Error;

  return (
    <div className="flex flex-col gap-5 p-5">
      <label className="flex flex-col gap-2">
        <div>
          <div className="text-ln-text-dark text-sm font-semibold">Expression</div>
        </div>

        <div data-ln-input="true" className="h-8 rounded-xl text-base">
          <ExpressionEditor.Root
            value={value}
            onChange={setValue}
            tokenize={tokenize}
            completionProvider={customProvider}
          >
            {/*!next 18 */}
            <ExpressionEditor.CompletionPopover className="border-ln-border bg-ln-bg-popover shadow-ln-shadow-400 overflow-hidden rounded-lg border py-1">
              <ExpressionEditor.CompletionList className="flex min-w-48 flex-col">
                {({ items }) =>
                  items.map((item, index) => (
                    <ExpressionEditor.CompletionListItem
                      key={item.id}
                      item={item}
                      index={index}
                      className="text-ln-text-dark hover:bg-ln-bg-strong aria-selected:bg-ln-primary-10 aria-selected:text-ln-primary-70 flex cursor-pointer select-none items-center gap-2.5 px-3 py-1.5 outline-none"
                    >
                      <KindBadge kind={item.kind} />
                      <span className="min-w-0 flex-1 truncate font-mono text-sm">{item.label}</span>
                      <span className="text-ln-text-xlight shrink-0 font-sans text-[10px]">{item.kind}</span>
                    </ExpressionEditor.CompletionListItem>
                  ))
                }
              </ExpressionEditor.CompletionList>
            </ExpressionEditor.CompletionPopover>
          </ExpressionEditor.Root>
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

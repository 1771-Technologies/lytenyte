import "@1771technologies/lytenyte-pro/light-dark.css";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/expression-editor.css";
import {
  createCompletionProvider,
  Evaluator,
  ExpressionEditor,
  standardPlugins,
} from "@1771technologies/lytenyte-pro/expressions";
import { useCallback, useMemo, useState } from "react";
import { ContextRows, KindBadge } from "./components.js";

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
  const [value, setValue] = useState("1 + 1");

  const result = useMemo(() => {
    try {
      if (!value) return "";

      return evaluator.run(value, context);
    } catch (e) {
      return e instanceof Error ? e : new Error(String(e));
    }
  }, [value]);

  const tokenize = useCallback((s: string) => evaluator.tokensSafe(s, true), []);
  //!next 4
  const provider = useMemo(() => {
    return createCompletionProvider(context);
  }, []);

  const isError = result instanceof Error;

  return (
    <div className="flex flex-col gap-5 p-5">
      <label className="flex w-full flex-col gap-2">
        <div>
          <div className="text-ln-text-dark text-sm font-semibold">Expression</div>
        </div>

        <div data-ln-input="true" className="h-10 text-base">
          <ExpressionEditor.Root
            value={value}
            onChange={setValue}
            tokenize={tokenize}
            completionProvider={provider}
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

      {/* Context */}
      <div className="flex flex-col gap-2">
        <div className="text-ln-text-light text-xs font-medium">Context</div>
        <div className="border-ln-border bg-ln-bg-light divide-ln-border divide-y overflow-hidden rounded-lg border">
          <ContextRows obj={context as Record<string, unknown>} />
        </div>
      </div>

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

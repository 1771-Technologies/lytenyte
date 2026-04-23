import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import "@1771technologies/lytenyte-pro/expression-editor.css";

import { salesData, type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import { computeField, Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import {
  createCompletionProvider,
  createResolvedIdentifierPlugin,
  Evaluator,
  ExpressionEditor,
  standardPlugins,
} from "@1771technologies/lytenyte-pro/expressions";
import { useCallback, useMemo, useRef, useState } from "react";
import type { RowLeaf } from "@1771technologies/lytenyte-pro/types";
import { ComputedCell, CostCell, KindBadge, NumberCell, ProfitCell } from "./components.js";

export interface GridSpec {
  readonly data: SaleDataItem;
}

const baseColumns: Grid.Column<GridSpec>[] = [
  { id: "product", name: "Product", width: 160 },
  { id: "productCategory", name: "Category", width: 120 },
  { id: "orderQuantity", name: "Quantity", type: "number", width: 60 },
  { id: "unitPrice", name: "Price", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "cost", name: "Cost", width: 80, type: "number", cellRenderer: CostCell },
  { id: "revenue", name: "Revenue", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "profit", name: "Profit", width: 80, type: "number", cellRenderer: ProfitCell },
];

const evaluator = new Evaluator(
  standardPlugins.concat([
    createResolvedIdentifierPlugin({
      identifiers: baseColumns.map((c) => c.name ?? c.id),
      args: ["row"],
    }),
  ]),
);

const columnsContext = Object.fromEntries(
  baseColumns.map((col) => [col.name ?? col.id, (row: RowLeaf) => computeField(col.field ?? col.id, row)]),
);

const provider = createCompletionProvider(
  Object.fromEntries(baseColumns.map((col) => [col.name ?? col.id, col.id])),
);

const EXAMPLES = [
  "Revenue - Cost",
  "Profit / Revenue * 100",
  "Quantity * Unit Price",
  "Revenue > 500 ? 'High' : 'Low'",
];

export default function ExpressionFieldsDemo() {
  const [value, setValue] = useState("Revenue - Cost");
  const [committed, setCommitted] = useState(value);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChange = (s: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setValue(s);
    debounceRef.current = setTimeout(() => setCommitted(s), 200);
  };

  const ast = useMemo(() => {
    if (!committed) return null;
    try {
      return evaluator.ast(committed);
    } catch {
      return null;
    }
  }, [committed]);

  const columns = useMemo((): Grid.Column<GridSpec>[] => {
    const nextColumns = [...baseColumns];
    nextColumns.splice(2, 0, {
      id: "computed",
      name: "Computed",
      type: "number",
      width: 140,
      widthFlex: 1,
      cellRenderer: ComputedCell,
      field: ({ row }) => {
        if (!ast || row.kind !== "leaf" || !row.data) return null;
        try {
          return evaluator.run(ast, { row, ...columnsContext }, { undefinedIdentifierFallback: true });
        } catch {
          return null;
        }
      },
    });

    return nextColumns;
  }, [ast]);

  const ds = useClientDataSource<GridSpec>({ data: salesData });
  const tokenize = useCallback((s: string) => evaluator.tokensSafe(s, true), []);

  return (
    <div className="ln-grid" style={{ display: "flex", flexDirection: "column" }}>
      <div className="border-b-ln-border flex w-full flex-col gap-2 border-b px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="text-ln-text-light text-xs font-medium">Computed column expression</span>
          <span className="text-ln-text-xlight font-sans text-[10px]">Use column names as identifiers</span>
        </div>

        <div data-ln-input="true" className="h-10 w-full text-base">
          <ExpressionEditor.Root
            value={value}
            onChange={onChange}
            tokenize={tokenize}
            className="flex-1"
            completionProvider={provider}
          >
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

        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map((expr) => (
            <button
              key={expr}
              type="button"
              onClick={() => {
                setValue(expr);
                setCommitted(expr);
              }}
              className="border-ln-border bg-ln-bg text-ln-text-dark hover:border-ln-primary-50 hover:bg-ln-primary-10 hover:text-ln-primary-50 cursor-pointer rounded-full border px-2.5 py-0.5 font-mono text-[11px] transition-colors"
            >
              {expr}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 460 }}>
        <Grid columns={columns} rowSource={ds} />
      </div>
    </div>
  );
}

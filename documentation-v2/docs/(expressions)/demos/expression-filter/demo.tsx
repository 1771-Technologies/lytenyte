import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import "@1771technologies/lytenyte-pro/expression-editor.css";

import { salesData, type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import { computeField, Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import {
  AgeGroup,
  CostCell,
  CountryCell,
  DateCell,
  GenderCell,
  KindBadge,
  NumberCell,
  ProfitCell,
} from "./components.jsx";
import {
  createCompletionProvider,
  createResolvedIdentifierPlugin,
  Evaluator,
  ExpressionEditor,
  standardPlugins,
} from "@1771technologies/lytenyte-pro/expressions";
import { useCallback, useMemo, useRef, useState } from "react";
import type { RowLeaf } from "@1771technologies/lytenyte-pro/types";
import { format } from "date-fns";

export interface GridSpec {
  readonly data: SaleDataItem;
}

export const columns: Grid.Column<GridSpec>[] = [
  { id: "date", name: "Date", cellRenderer: DateCell, width: 110 },
  { id: "age", name: "Age", type: "number", width: 80 },
  { id: "ageGroup", name: "Age Group", cellRenderer: AgeGroup, width: 160 },
  { id: "customerGender", name: "Gender", cellRenderer: GenderCell, width: 100 },
  { id: "country", name: "Country", cellRenderer: CountryCell, width: 150 },
  { id: "orderQuantity", name: "Quantity", type: "number", width: 60 },
  { id: "unitPrice", name: "Price", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "cost", name: "Cost", width: 80, type: "number", cellRenderer: CostCell },
  { id: "revenue", name: "Revenue", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "profit", name: "Profit", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "state", name: "State", width: 150 },
  { id: "product", name: "Product", width: 160 },
  { id: "productCategory", name: "Category", width: 120 },
  { id: "subCategory", name: "Sub-Category", width: 160 },
];

const evaluator = new Evaluator(
  standardPlugins.concat([
    createResolvedIdentifierPlugin({
      args: ["row"],
      identifiers: columns.map((x) => x.name ?? x.id),
    }),
  ]),
);

const FILTER_EXAMPLES = [
  'Gender == "Male" && Quantity > 10',
  'Country == "United States"',
  "Revenue > 1000",
  "Age >= 25 && Age <= 34",
  'Category == "Bikes"',
  '@"Age Group" == "Youth (<25)"',
];

const base: Grid.ColumnBase<GridSpec> = { width: 120 };
//#end
export default function GridDemo() {
  const [value, setValue] = useState('Gender == "Male" && Quantity > 10');
  const [committed, setCommitted] = useState(value);

  const columnsContext = useMemo(() => {
    return Object.fromEntries(
      columns.map((x) => {
        return [
          x.name ?? x.id,
          (row: RowLeaf) => {
            const value = computeField(x.field ?? x.id, row);

            if (x.id === "date") {
              if (typeof value !== "string") return "-";

              const niceDate = format(value, "yyyy MMM dd");
              return niceDate;
            }
            return value;
          },
        ];
      }),
    );
  }, []);

  const provider = useMemo(() => {
    return createCompletionProvider(Object.fromEntries(columns.map((x) => [x.name ?? x.id, x.id])));
  }, []);

  const filter = useMemo(() => {
    try {
      const ast = evaluator.ast(committed);

      const filter: Grid.T.FilterFn<GridSpec["data"]> = (row) => {
        return !!evaluator.run(
          ast,
          {
            row,
            ...columnsContext,
          },
          { undefinedIdentifierFallback: true },
        );
      };

      return filter;
    } catch {
      return null;
    }
  }, [columnsContext, committed]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChange = (s: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    setValue(s);
    debounceRef.current = setTimeout(() => {
      setCommitted(s);
    }, 200);
  };

  const ds = useClientDataSource<GridSpec>({ data: salesData, filter });

  const tokenize = useCallback((s: string) => evaluator.tokensSafe(s, true), []);
  return (
    <div className="ln-grid" style={{ display: "flex", flexDirection: "column" }}>
      <div className="border-b-ln-border flex w-full flex-col gap-2 border-b px-2 py-2">
        <div data-ln-input="true" className="h-10 w-full gap-2 py-0 text-base">
          <ExpressionEditor.Root
            value={value}
            onChange={onChange}
            tokenize={tokenize}
            className="flex-1"
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
        <div className="flex flex-wrap gap-1.5">
          {FILTER_EXAMPLES.map((expr) => (
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
      <div style={{ height: 500 }}>
        <Grid columns={columns} columnBase={base} rowSource={ds} />
      </div>
    </div>
  );
}

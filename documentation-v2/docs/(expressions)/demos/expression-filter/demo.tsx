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
            return computeField(x.field ?? x.id, row);
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
      <div className="border-b-ln-border flex w-full border-b px-2 py-2">
        <div data-ln-input="true" className="h-10 w-full gap-2 py-0 text-base">
          <div>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.96424 2.68571C10.0668 2.42931 9.94209 2.13833 9.6857 2.03577C9.4293 1.93322 9.13832 2.05792 9.03576 2.31432L5.03576 12.3143C4.9332 12.5707 5.05791 12.8617 5.3143 12.9642C5.5707 13.0668 5.86168 12.9421 5.96424 12.6857L9.96424 2.68571ZM3.85355 5.14646C4.04882 5.34172 4.04882 5.6583 3.85355 5.85356L2.20711 7.50001L3.85355 9.14646C4.04882 9.34172 4.04882 9.6583 3.85355 9.85356C3.65829 10.0488 3.34171 10.0488 3.14645 9.85356L1.14645 7.85356C0.951184 7.6583 0.951184 7.34172 1.14645 7.14646L3.14645 5.14646C3.34171 4.9512 3.65829 4.9512 3.85355 5.14646ZM11.1464 5.14646C11.3417 4.9512 11.6583 4.9512 11.8536 5.14646L13.8536 7.14646C14.0488 7.34172 14.0488 7.6583 13.8536 7.85356L11.8536 9.85356C11.6583 10.0488 11.3417 10.0488 11.1464 9.85356C10.9512 9.6583 10.9512 9.34172 11.1464 9.14646L12.7929 7.50001L11.1464 5.85356C10.9512 5.6583 10.9512 5.34172 11.1464 5.14646Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
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
      </div>
      <div style={{ height: 500 }}>
        <Grid columns={columns} columnBase={base} rowSource={ds} />
      </div>
    </div>
  );
}

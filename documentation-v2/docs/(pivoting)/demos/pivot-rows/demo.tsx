import "@1771technologies/lytenyte-pro-experimental/pill-manager.css";
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { salesData, type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import {
  computeField,
  Grid,
  PillManager,
  RowGroupCell,
  useClientDataSource,
} from "@1771technologies/lytenyte-pro-experimental";
import {
  AgeGroup,
  CostCell,
  CountryCell,
  DateCell,
  GenderCell,
  NumberCell,
  ProfitCell,
} from "./components.jsx";
import { sum } from "es-toolkit";
import { useMemo, useState } from "react";

export interface GridSpec {
  readonly data: SaleDataItem;
  readonly column: {
    pivotable?: boolean;
  };
}

export const columns: Grid.Column<GridSpec>[] = [
  { id: "date", name: "Date", cellRenderer: DateCell, width: 110 },
  { id: "age", name: "Age", type: "number", width: 80 },
  { id: "ageGroup", name: "Age Group", cellRenderer: AgeGroup, width: 110, pivotable: true },
  { id: "customerGender", name: "Gender", cellRenderer: GenderCell, width: 80, pivotable: true },
  { id: "country", name: "Country", cellRenderer: CountryCell, width: 150, pivotable: true },
  { id: "orderQuantity", name: "Quantity", type: "number", width: 60 },
  { id: "unitPrice", name: "Price", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "cost", name: "Cost", width: 80, type: "number", cellRenderer: CostCell },
  { id: "revenue", name: "Revenue", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "profit", name: "Profit", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "state", name: "State", width: 150, pivotable: true },
  { id: "product", name: "Product", width: 160, pivotable: true },
  { id: "productCategory", name: "Category", width: 120, pivotable: true },
  { id: "subCategory", name: "Sub-Category", width: 160, pivotable: true },
];

const base: Grid.ColumnBase<GridSpec> = { width: 120 };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
};

const aggSum: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values);
};

export default function PivotDemo() {
  const [colPivots, setColPivots] = useState<PillManager.T.PillItem[]>(() =>
    columns
      .filter((x) => x.pivotable)
      .map((x) => ({ id: x.id, name: x.name ?? x.id, active: x.id === "ageGroup" })),
  );
  const [rowPivots, setRowPivots] = useState<PillManager.T.PillItem[]>(() => {
    const pivotables = columns
      .filter((x) => x.pivotable)
      .map((x) => ({
        id: x.id,
        name: x.name ?? x.id,
        active: x.id === "country",
      }));

    const active = [...pivotables.filter((x) => x.active)];
    const notActive = [...pivotables.filter((x) => !x.active)];

    return [...active, ...notActive];
  });

  const ds = useClientDataSource<GridSpec>({
    data: salesData,
    pivotMode: true,
    pivotModel: {
      columns: colPivots.filter((x) => x.active),
      rows: rowPivots.filter((x) => x.active),
      measures: [
        {
          dim: { id: "profit", name: "Profit", type: "number", cellRenderer: ProfitCell, width: 120 },
          fn: "sum",
        },
      ],
    },
    aggregateFns: { sum: aggSum },
  });

  const pillRows = useMemo<PillManager.T.PillRow[]>(() => {
    const colPivotPills = colPivots.map((x) => {
      return {
        id: x.id,
        active: x.active,
        movable: x.active,
        name: x.name ?? x.id,
        data: x,
        removable: true,
      };
    });
    const rowPivotPills = rowPivots.map((x) => {
      return {
        id: x.id,
        active: x.active,
        movable: x.active,
        name: x.name ?? x.id,
        data: x,
        removable: true,
      };
    });
    return [
      {
        id: "column-pivots",
        label: "Column Pivots",
        type: "column-pivots",
        pills: colPivotPills,
        accepts: ["row-pivots"],
      },
      {
        id: "row-pivots",
        label: "Row Pivots",
        type: "row-pivots",
        pills: rowPivotPills,
        accepts: ["column-pivots"],
      },
    ];
  }, [colPivots, rowPivots]);

  const pivotProps = ds.usePivotProps();
  return (
    <>
      <div className="@container">
        <PillManager
          rows={pillRows}
          onPillItemActiveChange={(p) => {
            setColPivots((prev) => {
              const next = prev.map((x) =>
                x.id === p.item.id ? { ...x, active: p.item.active && p.row.id === "column-pivots" } : x,
              );
              return [...next.filter((x) => x.active), ...next.filter((x) => !x.active)];
            });
            setRowPivots((prev) => {
              const next = prev.map((x) =>
                x.id === p.item.id ? { ...x, active: p.item.active && p.row.id === "row-pivots" } : x,
              );
              return [...next.filter((x) => x.active), ...next.filter((x) => !x.active)];
            });
          }}
          onPillRowChange={(ev) => {
            for (const changed of ev.changed) {
              const activeFirst = changed.pills.filter((x) => x.active);
              const nonActive = changed.pills.filter((x) => !x.active);
              if (changed.id === "column-pivots") {
                setColPivots([...activeFirst, ...nonActive]);
              }
              if (changed.id === "row-pivots") {
                setRowPivots([...activeFirst, ...nonActive]);
              }
            }
          }}
        >
          {(row) => {
            return (
              <PillManager.Row row={row} className="relative">
                {row.id === "column-pivots" && (
                  <SwapPivots
                    onSwap={() => {
                      setColPivots(rowPivots);
                      setRowPivots(colPivots);
                    }}
                  />
                )}
                <PillManager.Label row={row} />
                <PillManager.Container>
                  {row.pills.map((x) => {
                    return <PillManager.Pill item={x} key={x.id} />;
                  })}
                </PillManager.Container>
                <PillManager.Expander />
              </PillManager.Row>
            );
          }}
        </PillManager>
      </div>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid columns={columns} rowSource={ds} columnBase={base} rowGroupColumn={group} {...pivotProps} />
      </div>
    </>
  );
}

function SwapPivots({ onSwap }: { onSwap: () => void }) {
  return (
    <button
      className="bg-ln-gray-02 border-ln-border-strong text-ln-primary-50 hover:bg-ln-gray-10 z-1 @2xl:-bottom-2.5 @2xl:left-7 absolute -bottom-2 left-3 flex cursor-pointer items-center gap-1 rounded-2xl border px-1 py-0.5 text-[10px]"
      onClick={() => onSwap()}
    >
      <span>
        <svg width="12" height="11" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.4819 6.09082L12.0422 7.53048L10.6025 6.09082"
            stroke="currentcolor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0.749587 7.42017L2.18925 5.98051L3.62891 7.42017"
            stroke="currentcolor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.0962 7.34067C12.1038 7.22805 12.1077 7.11441 12.1077 6.99985C12.1077 4.261 9.88744 2.04072 7.14859 2.04072C5.7388 2.04072 4.46641 2.62899 3.5635 3.57345M2.23753 6.30658C2.20584 6.53312 2.18945 6.76457 2.18945 6.99985C2.18945 9.73871 4.40973 11.959 7.14859 11.959C8.68732 11.959 10.0624 11.2582 10.972 10.1583"
            stroke="currentcolor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="sr-only">Swap row and column pivots</span>
      <span className="@2xl:block hidden">SWAP</span>
    </button>
  );
}

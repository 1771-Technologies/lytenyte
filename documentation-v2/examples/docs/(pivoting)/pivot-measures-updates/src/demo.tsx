import "@1771technologies/lytenyte-pro/pill-manager.css";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { salesData, type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import { computeField, Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import {
  AgeGroup,
  CostCell,
  CountryCell,
  DateCell,
  DecimalCell,
  GenderCell,
  NumberCell,
  ProfitCell,
} from "./components.jsx";
import { sum } from "es-toolkit";
import { useMemo, useState } from "react";
import { Menu, PillManager, RowGroupCell } from "@1771technologies/lytenyte-pro/components";

export interface GridSpec {
  readonly data: SaleDataItem;
  readonly column: {
    measurable?: boolean;
  };
}

export const columns: Grid.Column<GridSpec>[] = [
  { id: "date", name: "Date", cellRenderer: DateCell, width: 110 },
  { id: "age", name: "Age", type: "number", width: 80 },
  { id: "ageGroup", name: "Age Group", cellRenderer: AgeGroup, width: 110 },
  { id: "customerGender", name: "Gender", cellRenderer: GenderCell, width: 80 },
  { id: "country", name: "Country", cellRenderer: CountryCell, width: 150 },

  { id: "revenue", name: "Revenue", width: 80, type: "number", cellRenderer: ProfitCell, measurable: true },
  { id: "profit", name: "Profit", width: 100, type: "number", cellRenderer: ProfitCell, measurable: true },
  { id: "unitPrice", name: "Price", type: "number", width: 80, cellRenderer: NumberCell, measurable: true },
  { id: "cost", name: "Cost", width: 80, type: "number", cellRenderer: CostCell, measurable: true },
  {
    id: "orderQuantity",
    name: "Quantity",
    type: "number",
    width: 80,
    measurable: true,
    cellRenderer: DecimalCell,
  },

  { id: "state", name: "State", width: 150 },
  { id: "product", name: "Product", width: 160 },
  { id: "productCategory", name: "Category", width: 120 },
  { id: "subCategory", name: "Sub-Category", width: 160 },
];

const base: Grid.ColumnBase<GridSpec> = { width: 130, widthFlex: 1 };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
  pin: "start",
};

const aggSum: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values);
};
const aggAvg: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values) / values.length;
};
const aggMin: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return Math.min(...values);
};
const aggMax: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return Math.max(...values);
};

export default function PivotDemo() {
  const [measures, setMeasures] = useState<PillManager.T.PillItem[]>(() => {
    return columns
      .filter((x) => x.measurable)
      .map<PillManager.T.PillItem>((x) => ({
        id: x.id,
        active: x.id === "profit" || x.id === "revenue",
        movable: true,
        name: x.name,
      }));
  });

  const ds = useClientDataSource<GridSpec>({
    data: salesData,
    pivotMode: true,
    pivotModel: {
      columns: [{ id: "ageGroup" }],
      rows: [{ id: "country" }],
      measures: measures
        .filter((x) => x.active)
        .map((x) => {
          const column = columns.find((c) => x.id === c.id)!;
          return {
            dim: column,
            fn: (x.data as string) ?? "sum",
          };
        }),
    },
    aggregateFns: { sum: aggSum, avg: aggAvg, min: aggMin, max: aggMax },
  });

  const pillRows = useMemo<PillManager.T.PillRow[]>(() => {
    const measurePills = measures.map((x) => {
      return {
        id: x.id,
        active: x.active,
        name: x.name ?? x.id,
        data: x.data,
        removable: true,
      };
    });
    return [
      {
        id: "measures",
        label: "Measures",
        type: "measures",
        pills: measurePills,
      },
    ];
  }, [measures]);

  const pivotProps = ds.usePivotProps();
  return (
    <>
      <PillManager
        rows={pillRows}
        onPillItemActiveChange={(p) => {
          setMeasures((prev) => {
            const next = prev.map((x) =>
              x.id === p.item.id ? { ...x, active: p.item.active && p.row.id === "measures" } : x,
            );
            return [...next.filter((x) => x.active), ...next.filter((x) => !x.active)];
          });
        }}
        onPillRowChange={(ev) => {
          for (const changed of ev.changed) {
            const activeFirst = changed.pills.filter((x) => x.active);
            const nonActive = changed.pills.filter((x) => !x.active);
            if (changed.id === "measures") {
              setMeasures([...activeFirst, ...nonActive]);
            }
          }
        }}
      >
        {(row) => {
          return (
            <PillManager.Row row={row}>
              <PillManager.Label row={row} />
              <PillManager.Container>
                {row.pills.map((x) => {
                  return (
                    <PillManager.Pill
                      item={x}
                      key={x.id}
                      elementEnd={
                        x.active ? (
                          <div className="text-ln-primary-50 ms-1">
                            <Menu>
                              <Menu.Trigger
                                onClick={(e) => e.stopPropagation()}
                                className="text-ln-primary-50 hover:bg-ln-primary-30 cursor-pointer rounded-lg px-0.5 py-0.5 text-[10px]"
                              >
                                ({(x.data as string) ?? "sum"})
                              </Menu.Trigger>
                              <Menu.Popover>
                                <Menu.Container>
                                  <Menu.Arrow />

                                  {["sum", "avg", "max", "min"].map((agg) => {
                                    return (
                                      <Menu.Item
                                        key={agg}
                                        onAction={() => {
                                          setMeasures((prev) => {
                                            const next = [...prev];
                                            const nexIndex = prev.findIndex((m) => m.id === x.id);
                                            if (nexIndex === -1) return prev;

                                            next[nexIndex] = { ...next[nexIndex], data: agg.toLowerCase() };
                                            return next;
                                          });
                                        }}
                                      >
                                        {agg}
                                      </Menu.Item>
                                    );
                                  })}
                                </Menu.Container>
                              </Menu.Popover>
                            </Menu>
                          </div>
                        ) : null
                      }
                    />
                  );
                })}
              </PillManager.Container>
              <PillManager.Expander />
            </PillManager.Row>
          );
        }}
      </PillManager>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid
          columns={columns}
          rowSource={ds}
          columnBase={base}
          rowGroupColumn={group}
          {...pivotProps}
          styles={{
            headerGroup: {
              style: { position: "sticky", insetInlineStart: "var(--ln-start-offset)", overflow: "unset" },
            },
          }}
        />
      </div>
    </>
  );
}

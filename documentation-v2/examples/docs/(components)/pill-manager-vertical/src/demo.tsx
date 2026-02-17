import "@1771technologies/lytenyte-pro/pill-manager.css";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import type { Grid } from "@1771technologies/lytenyte-pro";
import { Menu, PillManager } from "@1771technologies/lytenyte-pro";
import { useMemo, useState } from "react";

export interface GridSpec {
  readonly data: SaleDataItem;
  readonly column: {
    pivotable?: boolean;
    measurable?: boolean;
    measure?: string;
  };
}

export const columns: Grid.Column<GridSpec>[] = [
  { id: "date", name: "Date" },
  { id: "age", name: "Age", type: "number" },
  { id: "ageGroup", name: "Age Group", pivotable: true },
  { id: "customerGender", name: "Gender", pivotable: true },
  { id: "country", name: "Country", pivotable: true },

  { id: "profit", name: "Profit", type: "number", measurable: true },
  { id: "orderQuantity", name: "Quantity", type: "number", measurable: true },
  { id: "unitPrice", name: "Price", type: "number", measurable: true },
  { id: "cost", name: "Cost", type: "number", measurable: true },
  { id: "revenue", name: "Revenue", type: "number", measurable: true },

  { id: "state", name: "State", pivotable: true },
  { id: "product", name: "Product", pivotable: true },
  { id: "productCategory", name: "Category", pivotable: true },
  { id: "subCategory", name: "Sub-Category", pivotable: true },
];

export default function ComponentDemo() {
  const [measures, setMeasures] = useState<PillManager.T.PillItem[]>(() => {
    return columns
      .filter((x) => x.measurable)
      .map<PillManager.T.PillItem>((x) => ({
        id: x.id,
        active: x.id === "profit",
        movable: true,
        name: x.name,
      }));
  });

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
      {
        id: "measures",
        label: "Measures",
        type: "measures",
        pills: measurePills,
      },
    ];
  }, [colPivots, measures, rowPivots]);

  return (
    <>
      <div className="@container" style={{ display: "flex", alignItems: "center" }}>
        <div className="w-full px-8 py-8">
          <PillManager
            className="justify-between gap-2"
            orientation="vertical"
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
                if (changed.id === "column-pivots") {
                  setColPivots([...activeFirst, ...nonActive]);
                }
                if (changed.id === "row-pivots") {
                  setRowPivots([...activeFirst, ...nonActive]);
                }
                if (changed.id === "measures") {
                  setMeasures([...activeFirst, ...nonActive]);
                }
              }
            }}
          >
            {(row) => {
              return (
                <PillManager.Row row={row} className="min-w-50 relative flex-1">
                  <PillManager.Label row={row} />
                  <PillManager.Container>
                    {row.pills.map((x) => {
                      if (row.id === "measures") {
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

                                        {["sum", "avg", "max", "min", "last", "first", "count"].map((agg) => {
                                          return (
                                            <Menu.Item
                                              key={agg}
                                              onAction={() => {
                                                setMeasures((prev) => {
                                                  const next = [...prev];
                                                  const nexIndex = prev.findIndex((m) => m.id === x.id);
                                                  if (nexIndex === -1) return prev;

                                                  next[nexIndex] = {
                                                    ...next[nexIndex],
                                                    data: agg.toLowerCase(),
                                                  };
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
                      }

                      return <PillManager.Pill item={x} key={x.id} />;
                    })}
                  </PillManager.Container>
                </PillManager.Row>
              );
            }}
          </PillManager>
        </div>
      </div>
    </>
  );
}

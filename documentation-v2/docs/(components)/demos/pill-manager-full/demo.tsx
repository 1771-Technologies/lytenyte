import "@1771technologies/lytenyte-pro-experimental/pill-manager.css";
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import type { Grid } from "@1771technologies/lytenyte-pro-experimental";
import { Menu, PillManager } from "@1771technologies/lytenyte-pro-experimental";
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

export default function PillManagerDemo() {
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
      <div className="@container" style={{ height: 400, display: "flex", alignItems: "center" }}>
        <div className="border-ln-border w-full border-t">
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
                  <PillManager.Expander />
                </PillManager.Row>
              );
            }}
          </PillManager>
        </div>
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

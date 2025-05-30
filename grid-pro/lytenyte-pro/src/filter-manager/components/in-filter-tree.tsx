import { useCallback, useEffect, useMemo, useState } from "react";
import { Checkbox } from "@1771technologies/lytenyte-core/internal";
import { useInFilterState } from "./in-filter-root";
import { getChildValues } from "./get-child-values";
import { useFilterManagerState } from "../filter-state-context";
import { flattenTreeItems } from "./flatten-tree-items";
import type { ColumnInFilterItemPro } from "@1771technologies/grid-types/pro";

export interface InFilterViewport {
  readonly treeItems: ColumnInFilterItemPro[];
  readonly itemHeight: number;
  readonly viewportHeight: number;
  readonly values: Set<unknown> | null;
  readonly onValuesChange: (s: Set<unknown> | null) => void;
  readonly filterValue: string;
}

export interface InFilterViewportProps {
  readonly itemHeight?: number;
  readonly viewportHeight?: number;
  readonly searchQuery?: string;
}

export function InFilterViewport({
  itemHeight,
  viewportHeight,
  searchQuery,
}: InFilterViewportProps) {
  const { treeFilterItems, hasError, isLoading } = useInFilterState();
  const { inFilterValue, setInFilterValue } = useFilterManagerState();

  if (hasError || isLoading) return null;

  return (
    <InFilterViewportImpl
      treeItems={treeFilterItems}
      itemHeight={itemHeight ?? 28}
      viewportHeight={viewportHeight ?? 300}
      filterValue={searchQuery ?? ""}
      onValuesChange={setInFilterValue}
      values={inFilterValue}
    />
  );
}

function InFilterViewportImpl({
  treeItems,
  itemHeight,
  viewportHeight,
  values,
  onValuesChange,
  filterValue,
}: InFilterViewport) {
  const [rowStart, setRowStart] = useState(0);
  const [rowEnd, setRowEnd] = useState(0);
  const [vp, setVp] = useState<HTMLDivElement | null>(null);
  const [expansions, setExpansions] = useState<Set<string>>(() => new Set());

  const unfilteredFlat = useMemo(() => {
    const selectAll: ColumnInFilterItemPro = {
      kind: "leaf",
      label: "Select All",
      value: null,
    };

    return [selectAll, ...flattenTreeItems(treeItems, expansions)];
  }, [expansions, treeItems]);

  const flat = useMemo(() => {
    if (!filterValue) return unfilteredFlat;

    return unfilteredFlat.filter((c) =>
      c.label.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()),
    );
  }, [filterValue, unfilteredFlat]);

  const allItemsAreLeafs = useMemo(() => {
    return flat.every((c) => c.kind === "leaf");
  }, [flat]);

  const handleVpChange = useCallback(() => {
    if (!vp) return;

    const scrollTop = vp.scrollTop;
    const height = vp.clientHeight;
    const rowStart = Math.max(Math.floor(scrollTop / itemHeight) - 10, 0);
    const rowEnd = Math.min(rowStart + Math.ceil(height / itemHeight) + 10, flat.length);

    setRowStart(rowStart);
    setRowEnd(rowEnd);
  }, [flat.length, itemHeight, vp]);

  useEffect(() => {
    void expansions;
    handleVpChange();
  }, [expansions, handleVpChange]);

  const indices = useMemo(() => {
    return Array.from({ length: rowEnd - rowStart }, (_, i) => i + rowStart);
  }, [rowEnd, rowStart]);

  const isSelected = (c: ColumnInFilterItemPro): boolean => {
    if (values === null) return true;

    if (c.label === "Select All" && c.kind === "leaf" && c.value === null) {
      return false;
    }
    if (c.kind === "leaf") return !values.has(c.value);

    return c.children.every((c) => isSelected(c));
  };

  const isIndeterminate = (c: ColumnInFilterItemPro): boolean => {
    if (c.label === "Select All" && c.kind === "leaf" && c.value === null) {
      const allItems = new Set(
        treeItems.flatMap((item) =>
          item.kind === "parent" ? [...getChildValues(item)] : item.value,
        ),
      );
      return values ? values.size > 0 && values.size !== allItems.size : false;
    }

    if (values === null) return false;
    if (c.kind === "leaf") return false;

    const childSet = [...getChildValues(c)];

    return childSet.some((c) => values.has(c)) && !childSet.every((c) => values.has(c));
  };

  return (
    <div
      ref={setVp}
      onScroll={handleVpChange}
      style={{
        height: viewportHeight,
        maxHeight: viewportHeight,
        minHeight: viewportHeight,
        overflowY: "auto",
        overflowX: "hidden",
        paddingBlock: 4,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div style={{ height: itemHeight * flat.length }}>
        {indices.map((c, i) => {
          const item = flat[c];
          if (!item) return null;

          const selected = isSelected(item);
          const indeterminate = isIndeterminate(item);

          const handleChange = () => {
            const allItems = new Set(
              treeItems.flatMap((item) =>
                item.kind === "parent" ? [...getChildValues(item)] : item.value,
              ),
            );

            if (item.label === "Select All" && item.kind === "leaf" && item.value === null) {
              // If no items are selected, then select all is by default true, so we should deselect everything.
              if (!values) {
                onValuesChange(allItems);
              } else {
                onValuesChange(null);
              }

              return;
            }

            if (!values) {
              const newSet = item.kind === "parent" ? getChildValues(item) : new Set([item.value]);

              onValuesChange(newSet);
              return;
            }

            if (item.kind === "leaf") {
              const newSet = new Set(values);

              if (newSet.has(item.value)) newSet.delete(item.value);
              else newSet.add(item.value);

              onValuesChange(newSet.size ? newSet : null);
              return;
            }

            const newSet = new Set(values);
            const nextValues = getChildValues(item);

            if (indeterminate || !selected) {
              for (const i of nextValues) {
                newSet.delete(i);
              }
            } else {
              for (const i of nextValues) {
                newSet.add(i);
              }
            }

            onValuesChange(newSet.size ? newSet : null);
          };

          return (
            <div
              key={c}
              tabIndex={i === 0 ? 0 : -1}
              className="lng1771-filter-manager__in-filter-tree"
              onClick={() => {
                handleChange();
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  const prev = e.currentTarget.previousElementSibling as HTMLElement | undefined;
                  if (prev) {
                    prev.focus();
                    e.preventDefault();
                  }
                } else if (e.key === "ArrowDown") {
                  const next = e.currentTarget.nextElementSibling as HTMLElement | undefined;
                  if (next) {
                    next.focus();
                    e.preventDefault();
                  }
                } else if (e.key === "Enter") {
                  handleChange();
                } else if (e.key === " ") {
                  if (item.kind === "parent") {
                    setExpansions((prev) => {
                      const next = new Set(prev);
                      if (prev.has(item.label)) {
                        next.delete(item.label);
                      } else next.add(item.label);

                      return next;
                    });
                  } else {
                    handleChange();
                  }
                  e.preventDefault();
                }
              }}
              style={{
                height: itemHeight,
                minHeight: itemHeight,
                maxHeight: itemHeight,
                paddingInlineStart: ((item as { depth: number }).depth ?? 0) * 16 + 8,
                transform: `translate3d(0px, ${itemHeight * c}px, 0px)`,
              }}
            >
              {item.kind !== "parent" ? (
                allItemsAreLeafs ? (
                  <></>
                ) : (
                  <div style={{ width: 20, height: 20 }} role="presentation"></div>
                )
              ) : (
                <>
                  {expansions.has(item.label) && (
                    <button
                      style={{
                        width: 20,
                        height: 20,
                        color: "var(--lng1771-gray-70)",
                        fontSize: 20,
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        setExpansions((prev) => {
                          const next = new Set(prev);
                          if (prev.has(item.label)) {
                            next.delete(item.label);
                          } else next.add(item.label);

                          return next;
                        });
                      }}
                    >
                      <span style={{ position: "relative", top: "-2px", insetInlineStart: "1px" }}>
                        ›
                      </span>
                    </button>
                  )}
                  {!expansions.has(item.label) && (
                    <button
                      style={{
                        width: 20,
                        height: 20,
                        color: "var(--lng1771-gray-70)",
                        fontSize: 20,
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        setExpansions((prev) => {
                          const next = new Set(prev);
                          if (prev.has(item.label)) {
                            next.delete(item.label);
                          } else next.add(item.label);

                          return next;
                        });
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          top: "-2px",
                          insetInlineStart: "1px",
                        }}
                      >
                        ›
                      </span>
                    </button>
                  )}
                </>
              )}
              <Checkbox
                tabIndex={-1}
                isChecked={selected || indeterminate}
                isDeterminate={indeterminate}
                onCheckChange={() => {
                  handleChange();
                }}
              />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

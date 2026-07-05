import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { salesData, type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import { Grid, useClientDataSource, virtualFromXY } from "@1771technologies/lytenyte-pro";
import { Menu, Popover } from "@1771technologies/lytenyte-pro/components";
import {
  AgeGroup,
  CostCell,
  CountryCell,
  DateCell,
  GenderCell,
  NumberCell,
  ProfitCell,
} from "./components.jsx";
import React, { useCallback, useMemo, useRef, useState } from "react";

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

const base: Grid.ColumnBase<GridSpec> = { width: 120 };

interface CellRef {
  rowId: string;
  colId: string;
  rowIndex: number;
  colIndex: number;
}

interface NoteEntry {
  text: string;
  rowIndex: number;
  colIndex: number;
}

function cellKey(rowId: string, colId: string) {
  return `${rowId}|${colId}`;
}

function NoteMarker() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        insetInlineEnd: 0,
        width: 0,
        height: 0,
        borderTop: "8px solid #f59e0b",
        borderInlineStart: "8px solid transparent",
      }}
    />
  );
}

const panelStyle: React.CSSProperties = {
  minWidth: 220,
  maxWidth: 300,
  background: "var(--ln-bg-popover)",
  border: "1px solid var(--ln-border-popover)",
  borderRadius: 8,
  padding: 10,
  boxShadow: "0 4px 16px var(--ln-border-field-and-button-shadow)",
};

const noteTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "var(--ln-text)",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

function NoteEditContent({
  initialValue,
  onAccept,
  onCancel,
}: {
  initialValue: string;
  onAccept: (text: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <textarea
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a note…"
        rows={3}
        style={{
          display: "block",
          width: "100%",
          minWidth: 220,
          minHeight: 60,
          resize: "both",
          border: "1px solid var(--ln-border-field-and-button)",
          borderRadius: 4,
          padding: "5px 8px",
          fontSize: 13,
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "inherit",
          background: "var(--ln-bg-form-field)",
          color: "var(--ln-text)",
        }}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onAccept(value);
          if (e.key === "Escape") onCancel();
        }}
      />
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <button
          onClick={() => onAccept(value)}
          style={{
            flex: 1,
            padding: "3px 10px",
            borderRadius: 4,
            border: "none",
            background: "var(--ln-primary-50)",
            color: "white",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "3px 10px",
            borderRadius: 4,
            border: "1px solid var(--ln-border-button-light)",
            background: "var(--ln-bg-button-light)",
            color: "var(--ln-text)",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
}

function getCellEl(target: EventTarget | null): HTMLElement | null {
  return (target as HTMLElement | null)?.closest?.("[data-ln-cell]") as HTMLElement | null;
}

const INITIAL_NOTES: Map<string, NoteEntry> = new Map([
  [
    "leaf-0|country",
    {
      text: "Canada is our strongest market for premium accessories this quarter.",
      rowIndex: 0,
      colIndex: 4,
    },
  ],
  ["leaf-0|age", { text: "Youth segment, bulk order of 8 units at full price.", rowIndex: 0, colIndex: 1 }],
  [
    "leaf-1|age",
    {
      text: "Same SKU, different customer, quantity dropped to 3. Worth investigating.",
      rowIndex: 1,
      colIndex: 1,
    },
  ],
  [
    "leaf-2|country",
    {
      text: "Australia showing strong demand for bike stands. Potential growth market.",
      rowIndex: 2,
      colIndex: 4,
    },
  ],
  [
    "leaf-3|orderQuantity",
    { text: "19 units of a $5 item, France is bulk-buying water bottles.", rowIndex: 3, colIndex: 5 },
  ],
  [
    "leaf-5|ageGroup",
    {
      text: "Youth female segment in France, 14 units. Higher than the male equivalent.",
      rowIndex: 5,
      colIndex: 2,
    },
  ],
  [
    "leaf-6|country",
    {
      text: "Germany showing repeat demand for low-cost accessories. Low margin but consistent volume.",
      rowIndex: 6,
      colIndex: 4,
    },
  ],
]);
const INITIAL_PINNED: Set<string> = new Set();

export default function GridDemo() {
  const [notes, setNotes] = useState<Map<string, NoteEntry>>(INITIAL_NOTES);
  const [hovered, setHovered] = useState<CellRef | null>(null);
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [editing, setEditing] = useState<CellRef | null>(null);
  const [editingEl, setEditingEl] = useState<HTMLElement | null>(null);
  const [pinnedKeys, setPinnedKeys] = useState<Set<string>>(INITIAL_PINNED);
  const [pinnedEls, setPinnedEls] = useState<Map<string, HTMLElement>>(new Map());
  const [menu, setMenu] = useState<CellRef | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<Grid.T.VirtualTarget | null>(null);

  const editingRef = useRef(editing);
  editingRef.current = editing;
  // Cell element of the last right-clicked cell; read when menu items are actioned.
  const menuElRef = useRef<HTMLElement | null>(null);
  const setPinnedElsRef = useRef(setPinnedEls);
  setPinnedElsRef.current = setPinnedEls;

  const clearHoveredTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ds = useClientDataSource<GridSpec>({ data: salesData });

  const cancelClear = useCallback(() => {
    if (clearHoveredTimeout.current) {
      clearTimeout(clearHoveredTimeout.current);
      clearHoveredTimeout.current = null;
    }
  }, []);

  // Annotations render only the triangle marker — all floating UI is handled by Popover below.
  // For pinned notes, a wrapper div captures the cell element via ref so the Popover can anchor to it.
  const annotations = useMemo<Grid.Annotation<GridSpec>[]>(() => {
    const result: Grid.Annotation<GridSpec>[] = [];
    for (const [key, entry] of notes) {
      const { rowIndex, colIndex } = entry;
      const isPinned = pinnedKeys.has(key);
      result.push({
        id: `note-${key}`,
        anchor: {
          kind: "range",
          rowStart: rowIndex,
          rowEnd: rowIndex + 1,
          colStart: colIndex,
          colEnd: colIndex + 1,
        },
        render: () => (
          <div
            ref={
              isPinned
                ? (el) => {
                    if (!el) return;
                    const cellEl = getCellEl(el);
                    if (cellEl)
                      setPinnedElsRef.current((p) => {
                        if (p.get(key) === cellEl) return p;
                        return new Map(p).set(key, cellEl);
                      });
                  }
                : undefined
            }
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <NoteMarker />
          </div>
        ),
      });
    }
    return result;
  }, [notes, pinnedKeys]);

  const events = useMemo<Grid.Events<GridSpec>>(
    () => ({
      cell: {
        contextMenu: ({ event, row, column, layout }) => {
          event.preventDefault();
          event.stopPropagation();
          setEditing(null);
          setEditingEl(null);
          setHovered(null);
          setHoveredEl(null);
          menuElRef.current = getCellEl(event.target);
          setMenuAnchor(virtualFromXY(event.clientX, event.clientY));
          setMenu({
            rowId: row.id,
            colId: column.id,
            rowIndex: layout.rowIndex,
            colIndex: layout.colIndex,
          });
        },
        keyDown: ({ event, row, column, layout }) => {
          if (event.key !== "F2" || editingRef.current) return;
          event.preventDefault();
          event.stopPropagation();
          const el = getCellEl(event.target);
          setEditing({
            rowId: row.id,
            colId: column.id,
            rowIndex: layout.rowIndex,
            colIndex: layout.colIndex,
          });
          setEditingEl(el);
        },
        mouseEnter: ({ layout, row, column, event }) => {
          if (editingRef.current) return;
          cancelClear();
          setHoveredEl(getCellEl(event.target));
          setHovered({
            rowId: row.id,
            colId: column.id,
            rowIndex: layout.rowIndex,
            colIndex: layout.colIndex,
          });
        },
        mouseLeave: () => {
          if (editingRef.current) return;
          clearHoveredTimeout.current = setTimeout(() => {
            setHovered(null);
            setHoveredEl(null);
            clearHoveredTimeout.current = null;
          }, 80);
        },
      },
    }),
    [cancelClear],
  );

  const hovKey = hovered ? cellKey(hovered.rowId, hovered.colId) : null;
  const menuKey = menu ? cellKey(menu.rowId, menu.colId) : null;
  const menuHasNote = !!menuKey && notes.has(menuKey);
  const menuIsPinned = !!menuKey && pinnedKeys.has(menuKey);

  // The tooltip shows when hovering a noted cell (not already pinned) or when the context
  // menu is open on a noted cell. In either case a single Popover handles the display.
  const tooltipNote =
    menu && menuHasNote && menuKey
      ? (notes.get(menuKey) ?? null)
      : !editing && hovKey && !pinnedKeys.has(hovKey)
        ? (notes.get(hovKey) ?? null)
        : null;
  const tooltipAnchor = menu && menuHasNote ? menuElRef.current : hoveredEl;

  const closeEditing = () => {
    setEditing(null);
    setEditingEl(null);
    setHovered(null);
    setHoveredEl(null);
  };

  return (
    <>
      <Menu
        anchor={menuAnchor}
        open={!!menu}
        modal={false}
        lockScroll
        onOpenChange={(b) => {
          if (!b) {
            setMenu(null);
            setMenuAnchor(null);
          }
        }}
      >
        <Menu.Popover>
          <Menu.Container>
            {menu && !menuHasNote && (
              <Menu.Item
                onAction={() => {
                  setEditing(menu);
                  setEditingEl(menuElRef.current);
                  setMenu(null);
                  setMenuAnchor(null);
                }}
              >
                Add Note
              </Menu.Item>
            )}
            {menu && menuHasNote && (
              <>
                <Menu.Item
                  onAction={() => {
                    setEditing(menu);
                    setEditingEl(menuElRef.current);
                    setMenu(null);
                    setMenuAnchor(null);
                  }}
                >
                  Edit Note
                </Menu.Item>
                <Menu.Item
                  onAction={() => {
                    const key = menuKey!;
                    setNotes((p) => {
                      const n = new Map(p);
                      n.delete(key);
                      return n;
                    });
                    setPinnedKeys((p) => {
                      const n = new Set(p);
                      n.delete(key);
                      return n;
                    });
                    setPinnedEls((p) => {
                      const n = new Map(p);
                      n.delete(key);
                      return n;
                    });
                    setMenu(null);
                    setMenuAnchor(null);
                  }}
                >
                  Delete Note
                </Menu.Item>
                <Menu.Item
                  onAction={() => {
                    const key = menuKey!;
                    const el = menuElRef.current;
                    if (menuIsPinned) {
                      setPinnedKeys((p) => {
                        const n = new Set(p);
                        n.delete(key);
                        return n;
                      });
                      setPinnedEls((p) => {
                        const n = new Map(p);
                        n.delete(key);
                        return n;
                      });
                    } else {
                      setPinnedKeys((p) => {
                        const n = new Set(p);
                        n.add(key);
                        return n;
                      });
                      if (el) {
                        setPinnedEls((p) => new Map(p).set(key, el));
                      }
                    }
                    setMenu(null);
                    setMenuAnchor(null);
                  }}
                >
                  {menuIsPinned ? "Hide Note" : "Show Note"}
                </Menu.Item>
              </>
            )}
          </Menu.Container>
        </Menu.Popover>
      </Menu>

      {/* Hover tooltip and menu-open tooltip share one Popover */}
      <Popover
        anchor={tooltipAnchor}
        open={!!tooltipNote && !!tooltipAnchor}
        modal={false}
        focusTrap={false}
        focusInitial={false}
        hide
        placement="top-end"
        sideOffset={8}
      >
        <Popover.Container
          style={{ ...panelStyle, borderRadius: 2, pointerEvents: menu ? "none" : undefined }}
          onMouseEnter={!menu ? cancelClear : undefined}
          onMouseLeave={
            !menu
              ? () => {
                  setHovered(null);
                  setHoveredEl(null);
                }
              : undefined
          }
        >
          <Popover.Arrow />
          <p style={noteTextStyle}>{tooltipNote?.text ?? ""}</p>
        </Popover.Container>
      </Popover>

      {/* Edit / add popover — modal so focus is trapped inside */}
      <Popover
        anchor={editingEl}
        open={!!editing}
        lockScroll={false}
        lightDismiss={false}
        onOpenChange={(open) => {
          if (!open) closeEditing();
        }}
        placement="top-end"
        sideOffset={8}
      >
        {editing && (
          <Popover.Container style={{ ...panelStyle, maxWidth: "none" }}>
            <Popover.Arrow />
            <NoteEditContent
              key={cellKey(editing.rowId, editing.colId)}
              initialValue={notes.get(cellKey(editing.rowId, editing.colId))?.text ?? ""}
              onAccept={(text) => {
                const key = cellKey(editing.rowId, editing.colId);
                setNotes((prev) => {
                  const next = new Map(prev);
                  if (text.trim()) {
                    next.set(key, {
                      text: text.trim(),
                      rowIndex: editing.rowIndex,
                      colIndex: editing.colIndex,
                    });
                  } else {
                    next.delete(key);
                  }
                  return next;
                });
                closeEditing();
              }}
              onCancel={closeEditing}
            />
          </Popover.Container>
        )}
      </Popover>

      {/* One Popover per pinned note, each anchored to its cell element */}
      {[...pinnedKeys].map((key) => {
        const note = notes.get(key);
        const el = pinnedEls.get(key);
        if (!note || !el) return null;
        return (
          <Popover
            key={key}
            anchor={el}
            open
            modal={false}
            focusTrap={false}
            hide
            placement="top-end"
            sideOffset={8}
          >
            <Popover.Container style={panelStyle}>
              <Popover.Arrow />
              <p style={noteTextStyle}>{note.text}</p>
            </Popover.Container>
          </Popover>
        );
      })}

      <div className="ln-grid" style={{ height: 500 }}>
        {/*!next */}
        <Grid columns={columns} columnBase={base} rowSource={ds} annotations={annotations} events={events} />
      </div>
    </>
  );
}

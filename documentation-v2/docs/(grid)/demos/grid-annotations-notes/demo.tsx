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
        borderTop: "8px solid #ef4444",
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
        onFocus={(e) => {
          const len = e.target.value.length;
          e.target.setSelectionRange(len, len);
        }}
        onKeyDownCapture={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onAccept(value);
          if (e.key === "Escape") onCancel();
        }}
      />
      <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--ln-text-secondary)" }}>
        Tip: Press Ctrl/Cmd + Enter to commit
      </p>
      <div style={{ display: "flex", gap: 6, marginTop: 6, justifyContent: "flex-end" }}>
        <button
          onClick={() => onAccept(value)}
          className="duration-120 bg-ln-primary-50 hover:bg-ln-primary-70 cursor-pointer transition-colors"
          style={{
            padding: "6px 14px",
            borderRadius: 4,
            border: "none",
            color: "white",
            fontSize: 12,
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-ln-bg-button-light hover:bg-ln-gray-30 duration-120 cursor-pointer transition-colors"
          style={{
            padding: "6px 14px",
            borderRadius: 4,
            border: "1px solid var(--ln-border-button-light)",
            color: "var(--ln-text)",
            fontSize: 12,
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
  const [menu, setMenu] = useState<CellRef | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<Grid.T.VirtualTarget | null>(null);

  const editingRef = useRef(editing);
  editingRef.current = editing;
  // Cell element of the last right-clicked cell; read when menu items are actioned.
  const menuElRef = useRef<HTMLElement | null>(null);
  const annotationElsRef = useRef(new Map<string, HTMLElement>());

  const clearHoveredTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ds = useClientDataSource<GridSpec>({ data: salesData });

  const cancelClear = useCallback(() => {
    if (clearHoveredTimeout.current) {
      clearTimeout(clearHoveredTimeout.current);
      clearHoveredTimeout.current = null;
    }
  }, []);

  // Annotations render only the triangle marker — all floating UI is handled by Popover below.
  // Each annotation captures the [data-ln-annotation-id] element (always in the DOM, positioned
  // via CSS transform) so pinned Popovers survive virtualization.
  const annotations = useMemo<Grid.Annotation<GridSpec>[]>(() => {
    const result: Grid.Annotation<GridSpec>[] = [];
    for (const [key, entry] of notes) {
      const { rowIndex, colIndex } = entry;
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
            ref={(el) => {
              if (el) {
                const annotationEl = el.closest("[data-ln-annotation-id]") as HTMLElement | null;
                if (annotationEl) annotationElsRef.current.set(key, annotationEl);
              } else {
                annotationElsRef.current.delete(key);
              }
            }}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <NoteMarker />
          </div>
        ),
      });
    }
    return result;
  }, [notes]);

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
          if (event.key !== "F2" || !event.shiftKey || event.ctrlKey || event.metaKey || editingRef.current) return;
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

  const editKey = editing ? cellKey(editing.rowId, editing.colId) : null;
  const editAnchor = (editKey && annotationElsRef.current.get(editKey)) ?? editingEl;

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
                    setMenu(null);
                    setMenuAnchor(null);
                  }}
                >
                  Delete Note
                </Menu.Item>
                <Menu.Item
                  onAction={() => {
                    const key = menuKey!;
                    setPinnedKeys((p) => {
                      const n = new Set(p);
                      if (menuIsPinned) n.delete(key);
                      else n.add(key);
                      return n;
                    });
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
        lightDismiss={false}
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
        anchor={editAnchor}
        open={!!editing}
        lockScroll={false}
        lightDismiss={false}
        onOpenChange={(open) => {
          if (!open) closeEditing();
        }}
        placement="right-start"
        sideOffset={8}
      >
        {editing && (
          <Popover.Container style={{ ...panelStyle, maxWidth: "none", padding: 4 }}>
            <Popover.Arrow />
            <NoteEditContent
              key={cellKey(editing.rowId, editing.colId)}
              initialValue={notes.get(cellKey(editing.rowId, editing.colId))?.text ?? ""}
              onAccept={(text) => {
                const key = cellKey(editing.rowId, editing.colId);
                if (!text.trim()) {
                  setPinnedKeys((p) => {
                    const n = new Set(p);
                    n.delete(key);
                    return n;
                  });
                }
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

      {/* One Popover per pinned note, anchored to the annotation element which is always
          in the DOM (positioned via CSS transform) so it survives row virtualization. */}
      {[...pinnedKeys].map((key) => {
        const note = notes.get(key);
        const el = annotationElsRef.current.get(key);
        if (!note || !el) return null;
        return (
          <Popover
            key={key}
            anchor={el}
            open
            modal={false}
            focusTrap={false}
            lightDismiss={false}
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

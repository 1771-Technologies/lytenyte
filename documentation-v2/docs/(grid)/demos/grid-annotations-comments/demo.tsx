import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { salesData, type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import {
  AgeGroup,
  CostCell,
  CountryCell,
  DateCell,
  GenderCell,
  NumberCell,
  ProfitCell,
} from "./components.jsx";
import { useMemo, useRef, useState } from "react";

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

// Identifies which cell is being tracked (hovered or edited).
interface CellRef {
  rowId: string;
  colId: string;
  rowIndex: number;
  colIndex: number;
}

// A comment stored alongside its last-known position for annotation anchoring.
interface CommentEntry {
  text: string;
  rowIndex: number;
  colIndex: number;
}

function cellKey(rowId: string, colId: string) {
  return `${rowId}|${colId}`;
}

// Triangle marker shown in the top-right corner of commented cells.
function CommentMarker() {
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

// Small "+" button shown when hovering a cell.
function AddCommentButton({
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        top: 2,
        right: 2,
        width: 18,
        height: 18,
        padding: 0,
        borderRadius: 3,
        border: "1px solid #cbd5e1",
        background: "white",
        color: "#64748b",
        fontSize: 14,
        lineHeight: "16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      }}
    >
      +
    </button>
  );
}

// Popover for writing or editing a comment.
// Owns its text input state so keystrokes do not re-render the parent.
function CommentPopover({
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
      <CommentMarker />
      <div
        style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: 4,
          minWidth: 220,
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: 10,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          zIndex: 10,
          pointerEvents: "auto",
        }}
        // Stop propagation so the grid cell's mouseLeave does not fire when
        // the pointer moves from the cell into the popover area.
        onMouseEnter={(e) => e.stopPropagation()}
        onMouseLeave={(e) => e.stopPropagation()}
      >
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a comment…"
          rows={3}
          style={{
            display: "block",
            width: "100%",
            resize: "vertical",
            border: "1px solid #e2e8f0",
            borderRadius: 4,
            padding: "5px 8px",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onAccept(value);
            if (e.key === "Escape") onCancel();
          }}
        />
        <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "3px 10px",
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              background: "white",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onAccept(value)}
            style={{
              padding: "3px 10px",
              borderRadius: 4,
              border: "none",
              background: "#3b82f6",
              color: "white",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default function GridDemo() {
  // Comments keyed by `rowId|colId`. Each entry stores the text and last-known
  // row/column indices so annotations can be anchored without an extra lookup.
  const [comments, setComments] = useState<Map<string, CommentEntry>>(new Map());

  // The cell the pointer is currently over (cleared while a popover is open).
  const [hovered, setHovered] = useState<CellRef | null>(null);

  // The cell whose comment popover is open.
  const [editing, setEditing] = useState<CellRef | null>(null);

  // Ref so the stable events object always sees the latest editing state.
  const editingRef = useRef(editing);
  editingRef.current = editing;

  // Pending timeout to clear hovered — cancelled if the pointer enters the button
  // before the timeout fires (cell→button mouseleave would otherwise dismiss the button).
  const clearHoveredTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ds = useClientDataSource<GridSpec>({ data: salesData });

  const annotations = useMemo<Grid.Annotation<GridSpec>[]>(() => {
    const result: Grid.Annotation<GridSpec>[] = [];

    const hovKey = hovered ? cellKey(hovered.rowId, hovered.colId) : null;
    const editKey = editing ? cellKey(editing.rowId, editing.colId) : null;

    // Persistent triangle for every commented cell that is not currently active.
    for (const [key, entry] of comments) {
      if (key === hovKey || key === editKey) continue;
      result.push({
        id: `comment-${key}`,
        anchor: {
          kind: "range",
          rowStart: entry.rowIndex,
          rowEnd: entry.rowIndex + 1,
          colStart: entry.colIndex,
          colEnd: entry.colIndex + 1,
        },
        render: () => <CommentMarker />,
      });
    }

    // "+" button on the hovered cell. Suppressed while a popover is open.
    if (hovered && !editing) {
      const { rowIndex, colIndex } = hovered;
      result.push({
        id: "cell-hover",
        anchor: {
          kind: "range",
          rowStart: rowIndex,
          rowEnd: rowIndex + 1,
          colStart: colIndex,
          colEnd: colIndex + 1,
        },
        render: () => (
          <AddCommentButton
            onClick={() => setEditing(hovered)}
            onMouseEnter={() => {
              if (clearHoveredTimeout.current) {
                clearTimeout(clearHoveredTimeout.current);
                clearHoveredTimeout.current = null;
              }
            }}
            onMouseLeave={() => setHovered(null)}
          />
        ),
      });
    }

    // Popover annotation for the cell being edited.
    if (editing) {
      const key = cellKey(editing.rowId, editing.colId);
      const existing = comments.get(key)?.text ?? "";
      const { rowIndex, colIndex } = editing;

      result.push({
        id: "cell-editing",
        anchor: {
          kind: "range",
          rowStart: rowIndex,
          rowEnd: rowIndex + 1,
          colStart: colIndex,
          colEnd: colIndex + 1,
        },
        render: () => (
          <CommentPopover
            initialValue={existing}
            onAccept={(text) => {
              setComments((prev) => {
                const next = new Map(prev);
                if (text.trim()) next.set(key, { text: text.trim(), rowIndex, colIndex });
                else next.delete(key);
                return next;
              });
              setEditing(null);
              setHovered(null);
            }}
            onCancel={() => {
              setEditing(null);
              setHovered(null);
            }}
          />
        ),
      });
    }

    return result;
  }, [comments, hovered, editing]);

  // Created once — reads editing state via refs to avoid stale closures.
  const events = useMemo<Grid.Events<GridSpec>>(
    () => ({
      cell: {
        mouseEnter: ({ layout, row, column }) => {
          if (editingRef.current) return;
          // Cancel any pending clear so moving cell→button→cell doesn't flicker.
          if (clearHoveredTimeout.current) {
            clearTimeout(clearHoveredTimeout.current);
            clearHoveredTimeout.current = null;
          }
          setHovered({
            rowId: row.id,
            colId: column.id,
            rowIndex: layout.rowIndex,
            colIndex: layout.colIndex,
          });
        },
        mouseLeave: () => {
          if (editingRef.current) return;
          // Delay so the button's onMouseEnter can cancel this before it fires.
          clearHoveredTimeout.current = setTimeout(() => {
            setHovered(null);
            clearHoveredTimeout.current = null;
          }, 80);
        },
      },
    }),
    [],
  );

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      {/*!next */}
      <Grid columns={columns} columnBase={base} rowSource={ds} annotations={annotations} events={events} />
    </div>
  );
}

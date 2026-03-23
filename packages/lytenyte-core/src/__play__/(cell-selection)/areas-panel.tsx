import type { DataRect } from "@1771technologies/lytenyte-shared";

interface AreasPanelProps {
  selections: DataRect[];
}

export function AreasPanel({ selections }: AreasPanelProps) {
  const totalCells = selections.reduce(
    (sum, r) => sum + (r.rowEnd - r.rowStart + 1) * (r.columnEnd - r.columnStart + 1),
    0,
  );

  return (
    <div className="areas-panel">
      <div className="areas-panel-header">
        <span className="areas-panel-title">Cell Selections</span>
        <span className="areas-panel-badge">
          {selections.length} area{selections.length !== 1 ? "s" : ""}
        </span>
        {totalCells > 0 && (
          <span className="areas-panel-total">{totalCells.toLocaleString()} cells selected</span>
        )}
      </div>

      {selections.length === 0 ? (
        <p className="areas-panel-empty">
          Click and drag to select a range · Hold <kbd>Ctrl</kbd> to add more areas
        </p>
      ) : (
        <ul className="areas-panel-list">
          {selections.map((rect, i) => {
            const rows = rect.rowEnd - rect.rowStart + 1;
            const cols = rect.columnEnd - rect.columnStart + 1;
            return (
              <li key={i} className="areas-panel-item">
                <span className="areas-panel-index">{i + 1}</span>
                <span className="areas-panel-range">
                  Rows {rect.rowStart}–{rect.rowEnd}
                </span>
                <span className="areas-panel-divider">·</span>
                <span className="areas-panel-range">
                  Cols {rect.columnStart}–{rect.columnEnd}
                </span>
                <span className="areas-panel-divider">·</span>
                <span className="areas-panel-size">
                  {rows} × {cols}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

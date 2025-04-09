import type { GridProReact } from "@1771technologies/grid-types/pro-react";
import "./grid-frame.css";

import { clsx } from "@1771technologies/js-utils";
import { Sizer } from "@1771technologies/react-sizer";
import type { SplitPaneAxe } from "@1771technologies/react-split-pane";
import { SplitPane, splitPaneAxe } from "@1771technologies/react-split-pane";
import { useMemo, useState, type PropsWithChildren } from "react";

export interface GridFrameConfiguration {
  readonly axe?: SplitPaneAxe;
}

export interface GridFrameProps<D> {
  readonly grid: GridProReact<D>;

  readonly axe?: SplitPaneAxe;
}

export function GridFrame<D>({
  grid: { api, state },
  children,
  axe,
}: PropsWithChildren<GridFrameProps<D>>) {
  const buttons = state.panelFrameButtons.use();
  const frames = state.panelFrames.use();
  const openId = state.internal.panelFrameOpen.use();

  const frame = openId ? frames[openId] : null;

  const [frameSplit, setFrameSplit] = useState(70);

  const template = useMemo(() => {
    const f = ["1fr"];
    if (buttons.length) f.push("32px");

    return f.join(" ");
  }, [buttons.length]);

  const cellSelectionEnabled = state.cellSelectionMode.use() !== "none";

  return (
    <div
      data-cell-selection-enabled={cellSelectionEnabled ? true : undefined}
      className="lng1771-grid-frame"
      style={{ gridTemplateColumns: template }}
    >
      {frame ? (
        <>
          <SplitPane
            axe={axe ?? splitPaneAxe}
            orientation="vertical"
            primary={<div className="lng1771-grid-frame__grid-area">{children}</div>}
            secondary={
              <Sizer className="lng1771-grid-frame__open-panel">
                <frame.component api={api} frame={frame} />
              </Sizer>
            }
            split={frame ? frameSplit : 100}
            onSplitChange={(n) => setFrameSplit(n)}
            min={20}
            max={80}
            splitterClassName="lng1771-grid-frame__open-panel--splitter"
          />
        </>
      ) : (
        <div>{children}</div>
      )}
      {buttons.length > 0 && (
        <div className="lng1771-grid-frame__controls">
          {buttons.map((c) => {
            const isActive = c.id === openId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  if (isActive) api.panelFrameClose();
                  else api.panelFrameOpen(c.id);
                }}
                className={clsx(
                  "lng1771-grid-frame__control-button",
                  c.id === openId && "lng1771-grid-frame__control-button--open",
                )}
              >
                <span className="lng1771-grid-frame__control-button-icon">
                  {c.icon && <c.icon />}
                </span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

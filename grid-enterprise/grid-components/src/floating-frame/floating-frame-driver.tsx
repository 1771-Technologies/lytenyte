import { Frame, type FrameAxeProps } from "@1771technologies/react-frame";
import { useGrid } from "../provider/grid-provider";
import { cc } from "../component-configuration";
import { t } from "@1771technologies/grid-design";
import { useEffect, useState } from "react";
import { getFrameCoords } from "./get-frame-coords";
import { clsx } from "@1771technologies/js-utils";
import { IconButton } from "../buttons/icon-button";
import { CrossIcon } from "../icons/cross-icon";

export interface FloatingFrameConfiguration {
  axe: FrameAxeProps;
}

export const FloatingFrameDriver = () => {
  const grid = useGrid();
  const frameId = grid.state.internal.floatingFrameOpen.use();

  if (!frameId) return;

  return <FloatingFrameImpl frameId={frameId} />;
};

function FloatingFrameImpl({ frameId }: { frameId: string }) {
  const grid = useGrid();
  const axe = cc.floatingFrame.use().axe;

  const frame = grid.state.floatingFrames.use()[frameId];

  const Component = frame.component;

  const [coords, setCoords] = useState(() => {
    return getFrameCoords(grid.api, frame);
  });

  const [dims, setDims] = useState(() => {
    return { width: frame.w ?? undefined, height: frame.h ?? undefined };
  });

  useEffect(() => {
    // We write directly to the object. This is much simpler than having to force a full re-render.
    // Whilst not purely correct React, this shouldn't cause any issues as the render phase values
    // come from the coords state.
    (frame as any).x = coords.x;
    (frame as any).y = coords.y;
    (frame as any).w = dims.width;
    (frame as any).h = dims.height;
  }, [coords, dims.height, dims.width, frame]);

  return (
    <Frame
      show
      onShowChange={() => grid.api.floatingFrameClose()}
      onMove={(x, y) => setCoords({ x, y })}
      onSizeChange={(w, h) => {
        setDims({ width: w, height: h });
      }}
      axe={axe}
      x={coords.x}
      y={coords.y}
      width={dims.width}
      height={dims.height}
      minHeight={300}
      minWidth={300}
      maxHeight={960}
      maxWidth={1280}
      title={frame.title}
      headerClassName={css`
        outline: none;
      `}
      header={
        <div
          className={clsx(
            "lng1771-text-large-700",
            css`
              outline: none;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-block: ${t.spacing.space_05};
              padding-inline: ${t.spacing.space_50};
              cursor: grab;
            `,
          )}
        >
          <div>{frame.title}</div>
          <div
            className={css`
              position: relative;
              left: 16px;
              top: -8px;
            `}
          >
            <IconButton kind="ghost" onClick={() => grid.api.floatingFrameClose()}>
              <CrossIcon />
            </IconButton>
          </div>
        </div>
      }
      style={{
        paddingBlockStart: t.spacing.space_20,
      }}
      className={css`
        border: none;
        border: 1px solid ${t.colors.borders_ui_panel};
        box-sizing: border-box;
        border-radius: ${t.spacing.box_radius_large};
        background-color: ${t.colors.backgrounds_ui_panel};
        box-shadow:
          0px 3px 20px 0px rgba(30, 30, 41, 0.1),
          0px 19px 24.75px -9px rgba(30, 30, 41, 0.11),
          0px 0px 0px 1px rgba(43, 68, 105, 0.07);

        &::backdrop {
          background-color: transparent;
        }
      `}
    >
      <Component api={grid.api} frame={frame} />
    </Frame>
  );
}
